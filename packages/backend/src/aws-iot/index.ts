import { EnumNumberMember } from '@babel/types';
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';
import { updatePivotController } from '../controllers/pivot';

export type IoTDeviceType = 'Raspberry' | 'Cloud';
class IoTDevice {
  private type: IoTDeviceType;
  private qos: mqtt.QoS;
  private pubTopic?: string = '';
  private subTopic: string = '';
  private clientId: string = '';
  private connection: mqtt.MqttClientConnection;
  // endpoint

  constructor(type: IoTDeviceType, qos: 0 | 1, node_id?: string) {
    this.type = type;
    this.qos = qos;
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
    } catch (err) {
      console.log(err);
    }

    console.log('subscribed!');
  }

  publish(payload: Object, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    console.log('publishing...');
    try {
      this.connection.publish(finalTopic!, JSON.stringify(payload), 1, false);
    } catch (err) {
      console.log(
        `Error publishing to topic: ${finalTopic} from ${this.clientId}`,
        err
      );
    }
  }

  async processMessage(
    topic: string,
    payload: ArrayBuffer,
    dup: boolean,
    qos: mqtt.QoS,
    retain: boolean
  ) {
    const decoder = new TextDecoder('utf8');

    if (this.type == 'Cloud') {
      const json: PivotToCloudMessage = JSON.parse(decoder.decode(payload));
      const{type, pivot_name, node_id, power, direction, water, angle, percentimeter, connection, timestamp} = json;

      if(type == "status") {
      // updatePivotController(pivot_name, "ONLINE", node_id, power, water, direction, angle, percentimeter);
      }
    }
    console.log(
      `Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`
    );
  }
}

type PivotToCloudMessage = {
  type: 'status';
  node_id: string;
  pivot_name: string;
  power: 1 | 2;
  direction: 3 | 4;
  water: 5 | 6;
  percentimeter: number;
  angle: number;
  timestamp: number;
  connection: 1 | 0;
};

export default IoTDevice;
