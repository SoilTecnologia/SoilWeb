import { EnumNumberMember } from '@babel/types';
import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { decode } from 'punycode';
import { TextDecoder } from 'util';
import { updatePivotController } from '../controllers/pivot';
import { IntentToString, stringToStatus } from '../utils/conversions';
import emitter from '../utils/eventBus';
import db from '../database';
import { updateIntentController } from '../controllers/intent';

export type IoTDeviceType = 'Raspberry' | 'Cloud';
class IoTDevice {
  private type: IoTDeviceType;
  private qos: mqtt.QoS;
  private pubTopic?: string = '';
  private subTopic: string = '';
  private clientId: string = '';
  private connection: mqtt.MqttClientConnection;
  private db: any;

  private pendingMessages: Array<any> = [];
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

    console.log('Starting Cloud.. Wait for connection..');

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
      console.log('Connected!');
    } catch (err) {
      console.log(err);
      await this.start();
    }

    if (this.type == 'Cloud') {
      console.log('on Cloud');
      emitter.on('intent', async (intentDetails) => {
        // Publish intent updates to nodes

        console.log('Adding new Intent to pending messages...');
        this.pendingMessages.push(intentDetails);
      });
    } else {
      console.log('on Rasp');
      emitter.on('status', async (statusDetails) => {
        // Publish status updates to aws

        // console.log('Adding new Status to pending messages...', statusDetails);
        this.publish(
          JSON.stringify({
            type: 'status',
            connection: statusDetails.connection,
            pivot_id: statusDetails.pivot_id,
            power: statusDetails.power,
            water: statusDetails.water,
            direction: statusDetails.direction,
            percentimeter: statusDetails.percentimeter
          }),
          'cloud'
        );
        // this.pendingMessages.push(statusDetails);
      });
    }

    setInterval(() => {
      this.checkPendingMessages();
    }, 5000);
  }

  async checkPendingMessages() {
  console.log("PENDING");
    if (this.type == 'Cloud') {
    console.log("CLOUD", this.pendingMessages.length);
      for (let pendingMessage of this.pendingMessages) {

      console.log(pendingMessage);
        const { power, water, direction, percentimeter } = pendingMessage;
        const { pivot_id, node_name, farm_name } = pendingMessage;
        if (!pivot_id) {
          console.log(`Publishing down to a GPRS: ${farm_name}/${node_name}`);
          await this.publish(
            IntentToString(power, water, direction, percentimeter),
            `${farm_name}/${node_name}`
          );
        } else {
          console.log(
            `Publishing down to a Raspberry: ${farm_name}/${node_name}`
          );
          await this.publish(
            JSON.stringify({
              farm_name,
              node_name,
              pivot_id,
              power,
              water,
              direction,
              percentimeter
            }),
            `${farm_name}/${node_name}`
          );
        }
      }
    } else {
      for (let pendingMessage of this.pendingMessages) {
        const { power, water, direction, percentimeter } = pendingMessage;
        const { pivot_id, node_name, farm_name, connection } = pendingMessage;
        await this.publish(
          JSON.stringify({
            type: 'status',
            node_name,
            farm_name,
            connection,
            pivot_id,
            power,
            water,
            direction,
            percentimeter
          }),
          'cloud'
        );
      }
    }
  }

  async publish(payload: string, topic?: string) {
    let finalTopic;
    if (this.type == 'Cloud') finalTopic = topic;
    else finalTopic = this.pubTopic;

    try {
      await this.connection.publish(finalTopic!, payload, 1, false);
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
    try {
      const json = JSON.parse(decoder.decode(payload));

      if (this.type == 'Cloud') {
        const { node_name, farm_name } = json;
        const { pivot_id, payload } = json;

        console.log(`Received message from ${farm_name}/${node_name}`);
        // console.log(pivot_id);
        if (!pivot_id) {
          for (let pendingMessage of this.pendingMessages) {
            // console.log(pendingMessage);
            if (
              pendingMessage.node_name === node_name &&
              pendingMessage.farm_name === farm_name
            ) {
              const gprsStatus = stringToStatus(payload);
              // console.log(payload);
              // console.log('RECEIVED NEW STATUS FROM GPRS:');
              // console.log(gprsStatus);

              if (
                gprsStatus.power == pendingMessage.power &&
                gprsStatus.water == pendingMessage.water &&
                gprsStatus.direction == pendingMessage.direction
              ) {
                // console.log('Removing pending message: ', pendingMessage);
                this.pendingMessages = this.pendingMessages.filter(
                  ({ node_name, farm_name }) =>
                    node_name != pendingMessage.node_name &&
                    farm_name != pendingMessage.farm_name
                );

                // console.log('Updating Pivot');

                const farm = await db.farm.findFirst({ where: { farm_name } });
                const node = await db.node.findFirst({
                  where: { node_name, farm_id: farm!.farm_id }
                });
                const pivot = await db.pivot.findFirst({
                  where: { node_id: node!.node_id }
                });
                const { pivot_id } = pivot!;

                await updatePivotController(
                  pivot_id,
                  'ONLINE',
                  gprsStatus.power,
                  gprsStatus.water,
                  gprsStatus.direction,
                  gprsStatus.angle,
                  gprsStatus.percentimeter
                );
              }
            }
          }
        } else {
	console.log("SEILA");
          if(json.type == "status") {
	  console.log("STATUS CHEGANTE");
              await updatePivotController(
                json.pivot_id,
                json.connection,
                json.power,
                json.water,
                json.direction,
                json.angle,
                json.percentimeter
              );

          } else {
          //SEPARAR POR TIPO, status ou intent response
          for (let pendingMessage of this.pendingMessages) {
            // console.log(pendingMessage);
              if (
                pendingMessage.node_name === node_name &&
                pendingMessage.farm_name === farm_name &&
                pendingMessage.pivot_id === pivot_id
              ) {
                // console.log('Removing pending message: ', pendingMessage);

                this.pendingMessages = this.pendingMessages.filter(
                  ({ node_name, farm_name }) =>
                    node_name != pendingMessage.node_name &&
                    farm_name != pendingMessage.farm_name &&
                    pivot_id != pendingMessage.pivot_id
                );
              }
            }
          }
        }
      } else {
        const {
          farm_name,
          node_name,
          pivot_id,
          power,
          water,
          direction,
          percentimeter
        } = json;

        // console.log('Updating intent...');

        if(json.type && json.type == "status") {
          for (let pendingMessage of this.pendingMessages) {
            // console.log(pendingMessage);
              if (
                pendingMessage.pivot_id === pivot_id
              ) {
                // console.log('Removing pending message: ', pendingMessage);

                this.pendingMessages = this.pendingMessages.filter(
                  ({ pivot_id }) =>
                    pivot_id != pendingMessage.pivot_id
                );
              }
            }
        } else {

        updateIntentController(
          pivot_id,
          power,
          water,
          direction,
          percentimeter
        );

        this.publish(
          JSON.stringify({
            type: 'intent',
            farm_name,
            node_name,
            pivot_id,
            power,
            water,
            direction,
            percentimeter
          }),
          `cloud`
        );
      }
    }
    } catch (err) {
      // console.log('Failed to decode message: ');
      // console.log(err);
    }

    // console.log(
    //   `Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`
    // // );
    // console.log('RECEBIDOOOO');
  };
}

// type ESPToCloudMessage = {
//   type: 'status';
//   node_id: string;
//   pivot_name: string;
//   esp_payload: StringStatusData;
// };

export default IoTDevice;
