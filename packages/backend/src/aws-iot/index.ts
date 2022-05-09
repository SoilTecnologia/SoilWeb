import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import { attempt } from 'lodash';
import { container } from 'tsyringe';
import { TextDecoder } from 'util';
import { ActionModel } from '../database/model/Action';
import { FarmModel } from '../database/model/Farm';
import { NodeModel } from '../database/model/Node';
import { PivotModel } from '../database/model/Pivot';
import { objectToActionString } from '../raspberry/common/objectToActionString';
import { CreateActionUseCase } from '../useCases/Actions/CreateAction/CreateActionUseCase';
import { GetOneNodeUseCase } from '../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { GetPivotByIdUseCase } from '../useCases/Pivots/GetById/GetByIdUseCase';
import { UpdatePivotStateUseCase } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { GetPivotStateUseCase } from '../useCases/States/GetPivotState/GetPivotStateUseCase';
import { StatusObject } from '../utils/conversions';
import emitter from '../utils/eventBus';
import { handleResultString } from '../utils/handleFarmIdWithUndescores';
import MessageQueue from '../utils/message_queue';
import { messageErrorTryAction } from '../utils/types';
import { handleCloudMessage } from './cloudMessage';
import { CheckGprs } from './gprsChecking';
import { socketIo } from './socketIo';
/*
Essa classe é responsável por fornecer uma abstração sobre a biblioteca aws-iot-device-sdk-v2.
Com ela, conseguimos fazer o envio de mensagens para o broker aws-iot-core, e, dependendo de como 
inicializamos sua instância, decidimos como ela deve ser utilizada.
*/

type ActionReceived = {
  farm_id: FarmModel['farm_id'];
  is_gprs: NodeModel['is_gprs'];
  node_num: NodeModel['node_num'];
  payload: {
    action_id: ActionModel['action_id'];
    pivot_id: PivotModel['pivot_id'];
    radio_id: PivotModel['radio_id'];
    author: ActionModel['author'];
    power: ActionModel['power'];
    water: ActionModel['water'];
    direction: ActionModel['direction'];
    percentimeter: ActionModel['percentimeter'];
    timestamp: Date;
  };
};

interface responseActive {
  id: string;
}
interface responseNotActiveProps extends responseActive {
  attempts: number;
}
// A biblioteca pode ser inicializada utilizando algum desses dois types:
export type IoTDeviceType = 'Raspberry' | 'Cloud';

class IoTDevice {
  private type: IoTDeviceType = 'Cloud'; // Tipo do dispositivo

  private qos: mqtt.QoS; // Qualidade do serviço

  private pubTopic?: string = ''; // Tópico de publicação

  private subTopic: string = ''; // Tópico de subscrição

  private clientId: string = ''; // Id do cliente (deve ser unico)

  private connection: mqtt.MqttClientConnection; // A conexão com o broker

  private queue: MessageQueue; // Fila de mensagens à serem enviadas

  private checkGprs: CheckGprs;

  private responseActives: responseActive[];
  private responseNotActive: responseNotActiveProps[];

  constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
    this.type = type;
    this.qos = qos;
    this.queue = new MessageQueue();
    this.checkGprs = new CheckGprs();
    this.responseActives = [{} as responseActive];
    this.responseNotActive = [{} as responseNotActiveProps];

    if (type === 'Raspberry' && topic) {
      this.subTopic = topic;
      this.pubTopic = `cloudHenrique`;
      this.clientId = topic;
    } else {
      this.subTopic = 'cloudHenrique';
      this.clientId = 'cloud1232145';
    }
  }
  /*
  Nessa função fazemos a inicialização da conexão usando a biblioteca aws-iot-device-sdk-v2.
  */
  async start() {
    const certPath = './src/aws-iot/device.pem.crt';
    const keyPath = './src/aws-iot/private.pem.key';
    const endpoint = 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com';

    try {
      let configBuilder: iot.AwsIotMqttConnectionConfigBuilder;
      configBuilder =
        await iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
          certPath,
          keyPath
        );

      await configBuilder.with_clean_session(false);
      await configBuilder.with_client_id(this.clientId);
      await configBuilder.with_endpoint(endpoint);
      // configBuilder.with_keep_alive_seconds(10);
      // configBuilder.with_ping_timeout_ms(1000);

      const config = await configBuilder.build();
      const client = new mqtt.MqttClient();

      this.connection = await client.new_connection(config);

      /*
      Aqui fazemos a conexão com o broker e o subscribe de um tópico dependendo do tipo de dispositivo.
      */

      await this.connection.connect();
      await this.connection.subscribe(
        this.subTopic,
        this.qos,
        this.processMessage
      );

      /*
      Aqui criamos a queue e o loop que irá ficar verificando se há mensagens na fila e enviando para o broker.
      */
      console.log(`${this.type} connected to AWS IoT Core!`);
      this.type === 'Cloud' && (await this.checkPivots());
      await this.setupQueue();
    } catch (err) {
      console.log('Aws does not connected'.toUpperCase());
      console.log(err);
    }
  }

  private getDate() {
    const catchDate = new Date();
    const dateString = catchDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
    const [date, hours] = dateString.split(' ');

    return { hours, date };
  }

  getStatePivot = async (pivot_id: string, connection: boolean) => {
    const getStateUseCase = container.resolve(GetPivotStateUseCase);
    const getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    const getPivot = container.resolve(GetPivotByIdUseCase);
    const getNode = container.resolve(GetOneNodeUseCase);
    try {
      const oldState = await getStateUseCase.execute(pivot_id);

      if (oldState) {
        if (oldState.connection !== connection) {
          await getUpdatePivotController.execute(
            pivot_id,
            connection,
            false,
            false,
            'CLOCKWISE',
            0,
            0,
            new Date(),
            null,
            null
          );

          const pivot = await getPivot.execute(pivot_id);
          const node = await getNode.execute(pivot?.node_id!!);
          pivot &&
            node &&
            emitter.emit('connection-pivot', {
              id: `${pivot.farm_id}_${node.node_num}`,
              pivot_id,
              pivot_num: pivot.pivot_num,
              connection
            });
        } else {
        }
      } else {
        await getUpdatePivotController.execute(
          pivot_id,
          connection,
          false,
          false,
          'CLOCKWISE',
          0,
          0,
          new Date(),
          null,
          null
        );
      }
    } catch (err) {
      messageErrorTryAction(err, false, IoTDevice.name, 'Atualizando Estado');
    }
  };

  private async checkResponseActive(pivot_id: string) {
    const existsPivot = this.responseActives.find((res) => res.id === pivot_id);
    if (existsPivot) {
      console.log(`Recebido resposta de ${pivot_id} enviando mensagem ativa`);
      this.responseActives = this.responseActives.filter(
        (res) => res.id !== pivot_id
      );
      await this.getStatePivot(pivot_id, true);
    } else {
      console.log(`Pivo fora do ar: ...${pivot_id}, `);
      const existsNotActive = this.responseNotActive.find(
        (res) => res.id === pivot_id
      );
      if (!existsNotActive) {
        console.log('Tentativas 1...');
        this.responseNotActive.push({ id: pivot_id, attempts: 1 });
        const payload = {
          payload: '000-000',
          type: 'status',
          id: pivot_id
        };
        await this.publish(payload, pivot_id);
        setTimeout(async () => {
          await this.checkResponseActive(pivot_id);
        }, 2000);
      } else {
        console.log(`Tentativa de conexão n° ${existsNotActive.attempts}`);
        if (existsNotActive.attempts >= 3) {
          await this.getStatePivot(pivot_id, false);
          this.responseNotActive = this.responseNotActive.filter(
            (res) => res.id !== pivot_id
          );
          console.log(
            `Tentativas excedidas no pivo ${pivot_id}, verificando estado...`
          );
          console.log('....');
        } else {
          const responseWithoutThis = this.responseNotActive.filter(
            (res) => res.id !== pivot_id
          );
          responseWithoutThis.push({
            id: existsNotActive.id,
            attempts: existsNotActive.attempts + 1
          });
          this.responseNotActive = responseWithoutThis;
          const payload = {
            payload: '000-000',
            type: 'status',
            id: pivot_id
          };
          await this.publish(payload, pivot_id);
          setTimeout(async () => {
            await this.checkResponseActive(pivot_id);
          }, 5000);
        }
      }
      // await this.getStatePivot(pivot_id, false)
    }
  }

  private async checkPivots() {
    this.getDate();
    const timeout = 10000 * 6 * 10;

    setInterval(async () => {
      const pivots = await this.checkGprs.starting();
      const { hours, date } = this.getDate();

      if (pivots && pivots.length > 0) {
        console.log(`Checagem de Conexão inciada as ${hours} do dia ${date}`);
        for (const pivot of pivots) {
          const payload = {
            payload: '000-000',
            type: 'status',
            id: pivot.pivot_id
          };
          await this.publish(payload, pivot.pivot_id);

          setTimeout(() => {
            this.checkResponseActive(pivot.pivot_id);
          }, 2000);
        }

        console.log('Finalizando Checagem de Conexão');
      } else {
        console.log('Does Not Found Pivots GPRS');
      }

      console.log('...');
    }, timeout);
  }
  /*
  Função que faz a publicação de mensagens e respostas.
  A função JSON.stringify() customizada converte o objeto em uma string, além de converter campos especiais como null para string. Isso é importante pois a resposta deve ser exatamente igual ao que o cliente enviou, e campos null normalmente são apagados quando se usa a função JSON.stringify() original.
 */

  public async publish(payload: any, topic?: string) {
    const finalTopic = this.type === 'Cloud' ? topic : this.pubTopic;

    try {
      const string = JSON.stringify(payload);

      console.log(`[IOT] Pivo ${finalTopic} Enviando mensagem... `);
      console.log('.......................');
      await this.connection.publish(finalTopic!, string, 0, false);
    } catch (err) {
      console.log(
        `Error publishing to topic: ${finalTopic} from ${this.clientId}`
      );
      console.log(err.message);
    }
  }

  /*
  Função que processa as mensagens recebidas do broker.
  O que acontece apartir disso, depende do tipo do dispositivo e do tipo da mensagem.
  */

  private processMessage = async (
    topic: string,
    message: ArrayBuffer,
    dup: boolean,
    qos: mqtt.QoS,
    retain: boolean
  ) => {
    const createActionUseCase = container.resolve(CreateActionUseCase);

    const decoder = new TextDecoder('utf8', { fatal: false });
    // const filteredMessage = messageToString.substring(0, messageToString.indexOf('}'))

    const json = JSON.parse(decoder.decode(message));
    const {
      type,
      id,
      pivot_num,
      payload
    }: {
      type: 'status' | 'action';
      id: string;
      pivot_num: number;
      payload: any;
    } = json;

    this.responseActives.push({ id: json.id });

    if (this.type === 'Cloud') {
      if (json.type === 'status') {
        const result = await handleCloudMessage.receivedStatus({
          pivot_id: id,
          payload
        });

        if (result) {
          this.publish(json, id);
          console.log(
            `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
          );
        }
      } else if (json.type === 'action') {
        this.queue.remove(json);
        console.log('[EC2-IOT-ACTION-ACK] Resposta de action recebida');
        socketIo('ackReceived', json);
      }
    } else if (this.type === 'Raspberry') {
      if (type === 'status') {
        if (json.payload) {
          console.log(`Type: ${JSON.stringify(type)}`);

          console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
          this.queue.remove(json);
        } else {
          console.log('Status Changed Connection Received from Aws');
          console.log(json);
          console.log('........');
        }
      } else if (type === 'action') {
        if (json.payload) {
          const { author, power, water, direction, percentimeter, timestamp } =
            json.payload;

          const newAction = {
            pivot_id: json.payload.pivot_id,
            author,
            power,
            water,
            direction,
            percentimeter
          };
          const newTimestamp = new Date(timestamp);

          try {
            await createActionUseCase.execute(newAction, newTimestamp);
          } catch (err) {
            messageErrorTryAction(err, false, IoTDevice.name, 'Create Action');
          }
          console.log(
            `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
          );
          this.publish(json);
        } else {
          console.log('Status Changed Connection Received from Aws');
          console.log(json);
          console.log('........');
        }
      }
    }
  };

  /*
  A função que cria a Queue adiciona listeners que irão receber eventos do banco de dados e adiciona-los a fila de mensagens. 
  OBS: a conversao do timestamp pra string é pra facilitar a comparação no método queue.remove
  */

  setupQueue = async () => {
    if (this.type === 'Raspberry') {
      emitter.on('status', (status) => {
        const idStrip: string[] = status.payload.pivot_id.split('_');
        const pivot_num = Number(idStrip.pop());

        this.queue.enqueue({
          type: 'status',
          id: `${status.farm_id}_${status.node_num}`, // TODO status ta vindo node_num?
          pivot_num,
          payload: {
            ...status.payload,
            timestamp: status.payload.timestamp.toString()
          },
          attempts: 1
        });
        console.log(
          `[RASPBERRY-IOT-STATUS] Adicionando mensagem à ser enviada`
        );
        this.processQueue();
        emitter.off('status', () => {});
      });
      emitter.on('connection-pivot', async (action) => {
        this.queue.enqueue({ type: 'status', ...action });
        this.processQueue();
        emitter.off('connection-pivot', () => {});
      });
    } else {
      emitter.on('connection-pivot', async (action) => {
        this.queue.enqueue({ type: 'status', ...action });
        this.processQueue();
        emitter.off('connection-pivot', () => {});
      });
      emitter.on('action', async (action: ActionReceived) => {
        const id = action.payload.pivot_id;
        const { node_num } = await handleResultString(id);

        // const pivotId = action.payload.pivot_id.split('_');
        if (action.is_gprs) {
          this.queue.enqueue({
            type: 'action',
            id: `${action.farm_id}_${action.node_num}`,
            pivot_num: Number(node_num),
            payload: objectToActionString(
              action.payload.power,
              action.payload.water,
              action.payload.direction,
              action.payload.percentimeter
            ),
            attempts: 0
          });
          console.log(`[EC2-IOT-ACTION] Adicionando mensagem à ser enviada`);
          emitter.off('action', () => {});
          this.processQueue();
        } else {
          console.log('action is gateway');

          const numId = action.node_num === 0 ? action.node_num : node_num;
          this.queue.enqueue({
            type: 'action',
            id: `${action.farm_id}_${numId}`, // TODO status ta vindo node_num?
            pivot_num: Number(node_num),
            payload: action.payload,
            attempts: 1
          });
          this.processQueue();
          emitter.off('action', () => {});
        }
      });
    }
  };

  processQueue = async () => {
    if (!this.queue.isEmpty()) {
      // Ready serve para parar qualquer outro loop de acessar a queue enquanto acessamos aqui

      for (const queue of this.queue._store) {
        if (queue.attempts && queue.attempts > 3) {
          console.log('[REMOVING ACTION FROM QUEUE] - Too Many Attempts');
          emitter.emit('action-ack-not-received', queue);

          console.log('');
          console.log(
            '              ACK not received in Action...             '
          );
          this.queue.remove(queue);
        } else {
          try {
            const raspOrCloud =
              this.type === 'Raspberry' ? this.pubTopic : queue.id;
            this.queue.remove(queue);
            await this.publish(queue, raspOrCloud);
          } catch (err) {
            console.log('ERROR AWS publish');
            console.log(err.message);
            queue.attempts!!++;
            if (queue.attempts!! > 3) {
              console.log('Error to received ACK');
              this.queue.remove(queue);
            } else {
              const currentQueue = this.queue.dequeue()!;
              this.queue.enqueue(currentQueue);
            }
          }
        }
      }
    }

    setTimeout(async () => {
      await this.processQueue();
    }, 10000);
  };
}

export default IoTDevice;
