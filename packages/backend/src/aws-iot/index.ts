import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import { container } from 'tsyringe';
import { TextDecoder } from 'util';
import { objectToActionString } from '../raspberry/common/objectToActionString';
import { CreateActionUseCase } from '../useCases/Actions/CreateAction/CreateActionUseCase';
import { UpdatePivotStateUseCase } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { statusPayloadStringToObject } from '../utils/conversions';
import emitter from '../utils/eventBus';
import MessageQueue from '../utils/message_queue';

/*
Essa classe é responsável por fornecer uma abstração sobre a biblioteca aws-iot-device-sdk-v2.
Com ela, conseguimos fazer o envio de mensagens para o broker aws-iot-core, e, dependendo de como 
inicializamos sua instância, decidimos como ela deve ser utilizada.
*/

// A biblioteca pode ser inicializada utilizando algum desses dois types:
export type IoTDeviceType = 'Raspberry' | 'Cloud';

class IoTDevice {
  private type: IoTDeviceType; // Tipo do dispositivo

  private qos: mqtt.QoS; // Qualidade do serviço

  private pubTopic?: string = ''; // Tópico de publicação

  private subTopic: string = ''; // Tópico de subscrição

  private clientId: string = ''; // Id do cliente (deve ser unico)

  private connection: mqtt.MqttClientConnection; // A conexão com o broker

  private ready: boolean = true; // Variavel auxiliar do loop da fila

  private queue: MessageQueue; // Fila de mensagens à serem enviadas

  constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
    this.type = type;
    this.qos = qos;
    this.queue = new MessageQueue();
    if (type === 'Raspberry' && topic) {
      this.subTopic = `${topic}`;
      this.pubTopic = `cloud3`;
      this.clientId = topic;
    } else {
      this.subTopic = 'cloud3';
      this.clientId = 'HenriqueDev';
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
        iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
          certPath,
          keyPath
        );

      configBuilder.with_clean_session(false);
      configBuilder.with_client_id(this.clientId);
      configBuilder.with_endpoint(endpoint);
      // configBuilder.with_keep_alive_seconds(10);
      // configBuilder.with_ping_timeout_ms(1000);

      const config = configBuilder.build();
      const client = new mqtt.MqttClient();

      this.connection = client.new_connection(config);

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

      await this.setupQueue();
    } catch (err) {
      console.log(err);
    }

    console.log(`${this.type} connected to AWS IoT Core!`);
  }

  /*
  Função que faz a publicação de mensagens e respostas.
  A função JSON.stringify() customizada converte o objeto em uma string, além de converter campos especiais como null para string. Isso é importante pois a resposta deve ser exatamente igual ao que o cliente enviou, e campos null normalmente são apagados quando se usa a função JSON.stringify() original.
 */

  publish(payload: any, topic?: string) {
    let finalTopic;
    if (this.type === 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    try {
      const string = JSON.stringify(payload, (k, v) =>
        v === undefined ? null : v
      );

      this.connection.publish(finalTopic!, string, 0, false);
      console.log(`[IOT] ${finalTopic} Enviando mensagem... ${string}`);
    } catch (err) {
      console.log(
        `Error publishing to topic: ${finalTopic} from ${this.clientId}`,
        err
      );
    }
  }

  /*
  Função que processa as mensagens recebidas do broker.
  O que acontece apartir disso, depende do tipo do dispositivo e do tipo da mensagem.
  */

  processMessage = async (
    topic: string,
    message: ArrayBuffer,
    dup: boolean,
    qos: mqtt.QoS,
    retain: boolean
  ) => {
    const updatePivotUseCase = container.resolve(UpdatePivotStateUseCase);
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

    console.log(`JSON: ${JSON.stringify(json)}`);
    const splitId = id.split('_');
    const newPivotId = `${splitId[0]}_${splitId[1]}`;

    const newJson = { ...json, id: newPivotId };
    if (this.type === 'Cloud') {
      if (json.type === 'status') {
        const [farm_id, node_num] = id.split('_');
        // Se possui um pivot_num, é um concentrador
        // Caso contrário podemos assumir que é um GPRS

        if (node_num === '0') {
          // Concentrador
          const {
            pivot_id,
            connection,
            power,
            water,
            direction,
            angle,
            percentimeter,
            timestamp,
            father,
            rssi
          } = payload;

          console.log(`Payload Concentrador: ${JSON.stringify(payload)}`);
          await updatePivotUseCase.execute(
            `${farm_id}_${pivot_num}`,
            connection,
            power,
            water,
            direction,
            angle,
            percentimeter,
            timestamp,
            father,
            rssi
          );
          /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
          this.publish(newJson, `${farm_id}_${node_num}`);
          console.log(
            `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
          );
        } else {
          // GPRS

          console.log('Received status from GPRS');
          const statusObject = statusPayloadStringToObject(payload);

          if (statusObject) {
            const { power, direction, water, percentimeter, angle, timestamp } =
              statusObject;
            await updatePivotUseCase.execute(
              `${farm_id}_${node_num}`, // Como node_num == pivot_num, seria o mesmo que colocar farm_id_pivot_num
              true,
              power,
              water,
              direction,
              angle,
              percentimeter,
              timestamp,
              null,
              null
            );
          }
        }
      } else if (json.type === 'action') {
        console.log('[EC2-IOT-ACTION-ACK] Resposta de action recebida');
        emitter.emit('action-ack-received', newJson);
        this.queue.remove(newJson);
      }
    } else if (this.type === 'Raspberry') {
      if (type === 'status') {
        console.log(`Type: ${JSON.stringify(type)}`);

        console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
        this.queue.remove(json);
      } else if (type === 'action') {
        const { author, power, water, direction, percentimeter, timestamp } =
          json.payload;
        const { farm_id } = json;

        const newAction = {
          pivot_id: `${farm_id}_${pivot_num}`,
          author,
          power,
          water,
          direction,
          percentimeter
        };
        const newTimestamp = new Date(timestamp);

        await createActionUseCase.execute(newAction, newTimestamp);
        console.log(
          `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
        );
        this.publish(json);
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
        const pivotId = status.payload.pivot_id.split('_');
        const pivot_num = pivotId[1];
        this.queue.enqueue({
          type: 'status',
          id: `${status.farm_id}_${status.node_num}`, // TODO status ta vindo node_num?
          pivot_num,
          payload: {
            ...status.payload,
            timestamp: status.payload.timestamp.toString()
          },
          attempts: 0
        });
        console.log(
          `[RASPBERRY-IOT-STATUS] Adicionando mensagem à ser enviada`
        );
        this.processQueue();
      });
    } else {
      emitter.on('action', (action) => {
        const pivotId = action.payload.pivot_id.split('_');
        const pivot_num = pivotId[1];
        if (action.is_gprs) {
          this.queue.enqueue({
            type: 'action',
            id: `${action.farm_id}_${action.node_num}`,
            pivot_num,
            payload: objectToActionString(
              action.payload.power,
              action.payload.water,
              action.payload.direction,
              action.payload.percentimeter
            ),
            attempts: 0
          });
          console.log(`[EC2-IOT-ACTION] Adicionando mensagem à ser enviada`);
          this.processQueue();
        } else {
          // this.queue.enqueue({
          //   type: 'action',
          //   farm_id: action.farm_id,
          //   node_num: action.node_num,
          //   pivot_num: action.pivot_num,
          //   is_gprs: false,
          //   payload: {
          //     ...action.payload,
          //     timestamp: action.payload.timestamp.toString()
          //   }
          // });
        }
      });
    }
  };

  processQueue = () => {
    if (this.ready && !this.queue.isEmpty()) {
      this.ready = false; // Ready serve para parar qualquer outro loop de acessar a queue enquanto acessamos aqui
      const current = this.queue.peek()!;
      const [farm_id, node_num] = current.id.split('_');

      if (current.attempts! < 3) {
        if (this.type === 'Raspberry') {
          this.publish(current, this.pubTopic);
        } else {
          this.publish(current, `${farm_id}_${node_num}`);
        }
        current.attempts!++;
      } else {
        console.log('[REMOVING ACTION FROM QUEUE] - Too Many Attempts');
        emitter.emit('action-ack-not-received', current);
        this.queue.remove(current);
        this.ready = true;
        return;
      }
      this.ready = true;
      setTimeout(() => {
        this.processQueue();
      }, 10.0 * 1000);
    }
  };
}

export default IoTDevice;
