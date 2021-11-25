import { EnumNumberMember } from '@babel/types';
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { decode } from 'punycode';
import { TextDecoder } from 'util';
import { updatePivotController } from '../controllers/pivot';
import { StatusStringToPrisma, StringStatusData } from '../utils/conversions';
import emitter from '../utils/eventBus';

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
      this.subTopic = `${node_id}`;
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

    if (this.type == 'Cloud') {
      emitter.on('intent', (intent) => {
        this.publish(intent, 'marcos-0-0');
      });
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

  processMessage = async (
    topic: string,
    payload: ArrayBuffer,
    dup: boolean,
    qos: mqtt.QoS,
    retain: boolean
  ) => {
    const decoder = new TextDecoder('utf8');
    // console.log(payload)

    // if (this.type == 'Cloud') {
    //   const json: PivotToCloudMessage = JSON.parse(decoder.decode(payload));
    //   const{type, pivot_name, node_id, power, direction, water, angle, percentimeter, connection, timestamp} = json;

    //   if(type == "status") {
    //   // updatePivotController(pivot_name, "ONLINE", node_id, power, water, direction, angle, percentimeter);
    //   }
    // }

    // console.log(
    //   `Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`
    // );
    console.log('RECEBIDOOOO');
    console.log(JSON.parse(decoder.decode(payload)));

    if (this.type == 'Cloud') {
      // const ESPPayload: ESPToCloudMessage = JSON.parse(decoder.decode(payload as any));
      // const {type, node_id, pivot_name, esp_payload} = ESPPayload;
      // const {power, connection, water, direction, angle, percentimeter, timestamp} = StatusStringToPrisma(esp_payload)
      // await updatePivotController(pivot_name, connection, node_id, power, water, direction, angle, percentimeter, /*timestamp*/)
    } else if (this.type == 'Raspberry') {
      //   const ESPPayload = JSON.parse(decoder.decode(payload as any));
      //   const {type, node_id, pivot_name, esp_payload} = ESPPayload;
      //   const {power, connection, water, direction, angle, percentimeter, timestamp} = StatusStringToPrisma(esp_payload)
      //   await updatePivotController(pivot_name, connection, node_id, power, water, direction, angle, percentimeter, /*timestamp*/)
      // }
    }
  };
}

// type ESPToCloudMessage = {
//   type: 'status';
//   node_id: string;
//   pivot_name: string;
//   esp_payload: StringStatusData;
// };

export default IoTDevice;
