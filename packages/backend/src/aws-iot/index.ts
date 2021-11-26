import { EnumNumberMember } from '@babel/types';
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { decode } from 'punycode';
import { TextDecoder } from 'util';
import { updatePivotController } from '../controllers/pivot';
import {
  StatusStringToPrisma,
  StringStatusData,
  IntentToString
} from '../utils/conversions';
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

  constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
    this.type = type;
    this.qos = qos;
    if (type == 'Raspberry' && topic) {
      this.subTopic = `${topic}`;
      this.pubTopic = `cloud`;
      this.clientId = topic;
    } else {
      this.subTopic = 'cloud';
      this.clientId = 'cloud';
    }
  }

  async start() {
    const certPath = './src/aws-iot/device.pem.crt';
    const keyPath = './src/aws-iot/private.pem.key';
    const endpoint = 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com';

    console.log("Starting Cloud.. Wait for connection..")

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
      console.log("Connected!")
    } catch (err) {
      console.log(err);
      await this.start(); 
    }

    if (this.type == 'Cloud') {
      console.log("CLOUD")
      emitter.on('intent', async (intentDetails) => {
        console.log("OPAA")
        console.log(intentDetails)
        const { power, water, direction, percentimeter } = intentDetails.intent;
        const { pivot_id, node_name, farm_name } = intentDetails;

        // Publish intent updates to nodes

        console.log("GOT HERE")
        if (!pivot_id) {
          console.log(`Publishing down to a GPRS: ${farm_name}/${node_name}`);
          await this.publish(
            IntentToString(power, water, direction, percentimeter),
            `${farm_name}/${node_name}`
          );
        } else {
          // console.log(`Publishing down to a Raspberry: ${farm_name}/${node_name}`);
          // await this.publish(
          //   { pivot_id, power, water, direction, percentimeter },
          //   `${farm_name}/${node_name}`
          // );
        }
      });
    }
  }

  async publish(payload: string, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    console.log('publishing...');
    try {
      await this.connection.publish(finalTopic!, payload, 1, false);
      console.log("Published!")
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
    try {
    console.log(JSON.parse(decoder.decode(payload)));
    }catch(err) {
      console.log("Failed to parse message:");
      console.log(payload)
    }

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
