import { iot, mqtt } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';
import { handleResultString } from '../utils/handleFarmIdWithUndescores';
import MessageQueue from '../utils/message_queue';
import { messageErrorTryAction } from '../utils/types';
import {
  HandleCloudMessageTypeRaspberry,
  HandleCloudMessageTypeCloud
} from './data';
import { SetupQueueCloud } from './data/Cloud/setupQueue';
import { SetupQueueRaspberry } from './data/Raspberry/setupQueue';
import { checkGprsInterval } from './data/utils/gprsChecking';
import { emitterResponse } from './data/utils/gprsChecking/emitterResponse';
/*
Essa classe é responsável por fornecer uma abstração sobre a biblioteca aws-iot-device-sdk-v2.
Com ela, conseguimos fazer o envio de mensagens para o broker aws-iot-core, e, dependendo de como 
inicializamos sua instância, decidimos como ela deve ser utilizada.
*/

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

  constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
    this.type = type;
    this.qos = qos;
    this.queue = new MessageQueue();

    const userLocal = 'Henriques123';
    const clientIdCloud = {
      newDev: 'cloudNewDev2022',
      newProd: 'cloudNewProd2022',
      pcLocal: `cloudLocal${userLocal}2022`
    };

    if (type === 'Raspberry' && topic) {
      this.subTopic = topic;
      this.pubTopic = `cloudHenrique`;
      this.clientId = `${topic}-${userLocal}`;
    } else {
      this.subTopic = 'cloudHenrique';
      this.clientId = clientIdCloud.pcLocal;
    }
  }
  /*
  Nessa função fazemos a inicialização da conexão usando a biblioteca aws-iot-device-sdk-v2.
  */
  async start() {
    const certPath = './src/aws-iot/keys/device.pem.crt';
    const keyPath = './src/aws-iot/keys/private.pem.key';
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

      this.connection =  client.new_connection(config);

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
      this.type === 'Cloud' && (await checkGprsInterval.checkPivots());
      await this.setupQueue();
    } catch (err) {
      console.log('Aws does not connected'.toUpperCase());
      console.log(err);
    }
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
    try {
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

      console.log(`Recebido ack ${JSON.stringify(json, null, 2)}`);
      
      const pivotId = payload.pivot_id || id

      if (type === 'status' && this.type === 'Cloud') {
        checkGprsInterval.addResponseStatus(pivotId);
      } else if (type === 'action') {
        emitterResponse.addActionStatus(pivotId);
      }
      
      const {node_num} = handleResultString(id)
      if (this.type === 'Cloud') {
        if (json.type === 'status') {
          
          const result = await HandleCloudMessageTypeCloud.receivedStatus({
            pivot_id: pivotId,
            payload,
            node_num
          });

          if (result) {
            this.publish(json, id);
            console.log(
              `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
            );
          }
        } else if (json.type === 'action') {
          await HandleCloudMessageTypeCloud.receivedAction(json, this.queue);
        }
      }

      if (this.type === 'Raspberry') {
        if (type === 'status')
          await HandleCloudMessageTypeRaspberry.receivedStatus(
            this.queue,
            json
          );
        else if (type === 'action')
          await HandleCloudMessageTypeRaspberry.receivedAction(json);
      }
    } catch (err) {
      messageErrorTryAction(err, false, IoTDevice.name, 'Process Message');
    }
  };

  /*
  A função que cria a Queue adiciona listeners que irão receber eventos do banco de dados e adiciona-los a fila de mensagens. 
  OBS: a conversao do timestamp pra string é pra facilitar a comparação no método queue.remove
  */

  setupQueue = async () => {
    if (this.type === 'Raspberry') {
      const setupQueueRaspberry = new SetupQueueRaspberry(this.pubTopic);
      setupQueueRaspberry.listeningEmitter();
    } else {
      const setupQueueCloud = new SetupQueueCloud(this.pubTopic);
      setupQueueCloud.listeningEmitter();
    }
  };
}

export default IoTDevice;
