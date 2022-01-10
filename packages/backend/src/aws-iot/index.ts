import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';
import Queue from '../utils/queue';
import emitter from '../utils/eventBus';
import { updatePivotController } from '../controllers/pivots';
import { createActionController } from '../controllers/actions';

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
      }, 5000);
    } catch (err) {
      console.log(err);
    }

    console.log(`${this.type} connected to AWS IoT Core!`);
  }

  publish(payload: Object, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    try {
      var string = JSON.stringify(payload, function (k, v) {
        return v === undefined ? null : v;
      });
      this.connection.publish(finalTopic!, string, 0, false);
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
      } else if (json.type === 'action') {
          console.log('Resposta de action recebido na cloud');
          this.queue.remove(json);
      }
    } else {
      if (json.type === 'status') {
        console.log('Resposta de status recebido na rasp');
        this.queue.remove(json);
      } else if (json.type === 'action') {
        console.log(json)
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
        this.publish(json);
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
          payload: {
            ...status.payload,
            timestamp: status.payload.timestamp.toString()
          }
        });
        //OBS: a conversao do timestamp pra string é pra facilitar a comparação no método queue.remove
      });
    } else {
      emitter.on('action', (action) => {
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
    }
  };

  processQueue = () => {
    if (!this.queue.isEmpty()) {
      const current = this.queue.peek()!;

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