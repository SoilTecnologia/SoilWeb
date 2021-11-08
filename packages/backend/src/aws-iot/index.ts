import { mqtt, iot } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

export type IoTDeviceType = 'Raspberry' | 'Cloud';
class IoTDevice {
  type: IoTDeviceType;
  qos: mqtt.QoS;
  topic: string = '';
  // endpoint

  constructor(type: IoTDeviceType, qos: 0 | 1, farm_id?: string) {
    this.type = type;
    this.qos = qos;
    if (type == 'Raspberry' && farm_id) {
      this.topic = `rasp/${farm_id}`;
    } else {
      this.topic = 'cloud';
    }
  }

  async start() {
    const certPath = './src/aws-iot/device.pem.crt';
    const keyPath = './src/aws-iot/private.pem.key';
    const endpoint = 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com';
    const clientId = './cloud';

    try {
      let configBuilder: iot.AwsIotMqttConnectionConfigBuilder;
      configBuilder =
        iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
          certPath,
          keyPath
        );

      configBuilder.with_clean_session(false);
      configBuilder.with_client_id(clientId);
      configBuilder.with_endpoint(endpoint);

      const config = configBuilder.build();
      const client = new mqtt.MqttClient();

      const connection = client.new_connection(config);
      const decoder = new TextDecoder('utf8');

      await connection.connect();

      await connection.subscribe(
        'cloud',
        this.qos,
        async (
          topic: string,
          payload: ArrayBuffer,
          dup: boolean,
          qos: mqtt.QoS,
          retain: boolean
        ) => {
          const json = decoder.decode(payload);
          console.log(
            `Publish received. topic:"${topic}" dup:${dup} qos:${qos} retain:${retain}`
          );

          console.log(json);
        }
      );

      connection.publish(this.topic, JSON.stringify('OIE'), 1, false);
    } catch (err) {
      console.log(typeof err);
    }
  }
}

export default IoTDevice;
