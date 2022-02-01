import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';
import Queue from '../utils/queue';
import emitter from '../utils/eventBus';
import { updatePivotController } from '../controllers/pivots';
import { createActionController } from '../controllers/actions';
import { objectToActionString } from '../utils/conversions';

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
  private queue: Queue<MessageQueue>; // Fila de mensagens à serem enviadas

  constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
    this.type = type;
    this.qos = qos;
    this.queue = new Queue<MessageQueue>();
    if (type == 'Raspberry' && topic) {
      this.subTopic = `${topic}`;
      this.pubTopic = `cloud2`;
      this.clientId = topic;
    } else {
      this.subTopic = 'cloud2';
      this.clientId = 'cloud2';
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
      setInterval(() => {
        if (this.ready) this.processQueue();
      }, 5000);
    } catch (err) {
      console.log(err);
    }

    console.log(`${this.type} connected to AWS IoT Core!`);
  }

  /*
  Função que faz a publicação de mensagens e respostas.
  A função JSON.stringify() customizada converte o objeto em uma string, além de converter campos especiais como null para string, isso é importante pois a resposta deve ser exatamente igual ao que o cliente enviou, e campos null normalmente são apagados quando se usa a função JSON.stringify() original.
  */

  publish(payload: Object, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    try {
      let string = JSON.stringify(payload, function (k, v) {
        return v === undefined ? null : v;
      });
      this.connection.publish(finalTopic!, string, 0, false);
      console.log(`[IOT] Enviando mensagem...`);
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
    payload: ArrayBuffer,
    dup: boolean,
    qos: mqtt.QoS,
    retain: boolean
  ) => {
    const decoder = new TextDecoder('utf8');
    const json = JSON.parse(decoder.decode(payload));

    if (this.type === 'Cloud') {
      if (json.type === 'status') {
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
        } = json.payload;
        await updatePivotController(
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
        );

        /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
        const { farm_id, node_name } = json;
        this.publish(json, `${farm_id}/${node_name}`);
        console.log(
          `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
        );
      } else if (json.type === 'action') {
        console.log('[EC2-IOT-ACTION-ACK] Resposta de action recebida');
        this.queue.remove(json);
      }
    } else {
      if (json.type === 'status') {
        console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
        this.queue.remove(json);
      } else if (json.type === 'action') {
        const {
          pivot_id,
          radio_id,
          author,
          power,
          water,
          direction,
          percentimeter,
          timestamp
        } = json.payload;
        await createActionController(
          pivot_id,
          author,
          power,
          water,
          direction,
          percentimeter,
          new Date(timestamp)
        );
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
    if (this.type == 'Raspberry') {
      emitter.on('status', (status) => {
        this.queue.enqueue({
          type: 'status',
          farm_id: status.farm_id,
          node_name: status.node_name,
          payload: {
            ...status.payload,
            timestamp: status.payload.timestamp.toString()
          }
        });
        console.log(
          `[RASPBERRY-IOT-STATUS] Adicionando mensagem à ser enviada`
        );
      });
    } else {
      emitter.on('action', (action) => {
        if (action.is_gprs) {
          this.queue.enqueue({
            type: 'action',
            farm_id: action.farm_id,
            node_name: action.node_name,
            payload: objectToActionString(
              action.power,
              action.water,
              action.direction,
              action.percentimeter
            )
          });
        }
        this.queue.enqueue({
          type: 'action',
          farm_id: action.farm_id,
          node_name: action.node_name,
          payload: {
            ...action.payload,
            timestamp: action.payload.timestamp.toString()
          }
        });
      });

      console.log(`[EC2-IOT-ACTION] Adicionando mensagem à ser enviada`);
    }
  };

  processQueue = () => {
    if (!this.queue.isEmpty()) {
      const current = this.queue.peek()!;

      if (this.type === 'Raspberry') this.publish(current, this.pubTopic);
      else {
        if (typeof current.payload === 'string')
          this.publish(current.payload, `${current.farm_id}/${current.node_name}`);
        else this.publish(current, `${current.farm_id}/${current.node_name}`);
      }
    }
  };
}

type MessageQueue = {
  type: 'action' | 'status';
  farm_id: string;
  node_name: number;
  payload: any;
};

export default IoTDevice;
