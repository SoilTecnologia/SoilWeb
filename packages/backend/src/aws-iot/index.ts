import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';
import Queue from '../utils/queue';
import emitter from '../utils/eventBus';
import { updatePivotController } from '../controllers/pivots';

export type IoTDeviceType = 'Raspberry' | 'Cloud';
class IoTDevice {
  private type: IoTDeviceType;
  private qos: mqtt.QoS;
  private pubTopic?: string = '';
  private subTopic: string = '';
  private clientId: string = '';
  private connection: mqtt.MqttClientConnection;
  private ready: boolean = true;
  private queue: Queue<MessageQueue>;
  // endpoint

  constructor(type: IoTDeviceType, qos: 0 | 1, node_id?: string) {
    this.type = type;
    this.qos = qos;
    this.queue = new Queue<MessageQueue>();
    if (type == 'Raspberry' && node_id) {
      this.subTopic = `rasp/${node_id}`;
      this.pubTopic = `cloud`;
      this.clientId = node_id;
    } else {
      this.subTopic = 'cloud';
      this.clientId = 'cloud';
    }
  }

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

      await this.connection.connect();
      await this.connection.subscribe(
        this.subTopic,
        this.qos,
        this.processMessage
      );

      await this.setupQueue();
      setInterval(() => {
        if (this.ready) this.processQueue();
      }, 2000);
    } catch (err) {
      console.log(err);
    }

    console.log(`${this.type} connected to AWS IoT Core!`);
  }

  publish(payload: Object, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    console.log('publishing...');
    try {
      this.connection.publish(finalTopic!, JSON.stringify(payload), 0, false);
    } catch (err) {
      console.log(
        `Error publishing to topic: ${finalTopic} from ${this.clientId}`,
        err
      );
    }
  }

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
          father,
          rssi
        );

        /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
        const { farm_id, node_name } = json;
        this.publish(json, `${farm_id}/${node_name}`);
      } else {
        // TODO dar um jeito de remover o action respondido da queue da cloud
      }
    } else {
      console.log("Resposta de status recebido na rasp");
      if(json.type === "status") {
        // TODO dar um jeito de remover o status respondido da queue da raspberry
      } else if(json.type === "action") {
        // TODO assim que receber a intencao, publicar o mesmo payload pra cloud pra avisar que recebeu
      }
    }
  };

  setupQueue = async () => {
    if (this.type == 'Raspberry') {
      emitter.on('status', (status) => {
        this.queue.enqueue({
          type: 'status',
          farm_id: status.farm_id,
          node_name: status.node_name,
          payload: status.payload
        });
      });
    } else {
      // TODO fazer um emitter pra qndo receber intenções na nuvem, dai adicionar a queue
    }
  };

  processQueue = () => {
    if (!this.queue.isEmpty()) {
      const current = this.queue.dequeue()!;

      if (this.type === 'Raspberry') this.publish(current, this.pubTopic);
      else this.publish(current, `${current.farm_id}/${current.node_name}`);

      console.log('Published...');
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
