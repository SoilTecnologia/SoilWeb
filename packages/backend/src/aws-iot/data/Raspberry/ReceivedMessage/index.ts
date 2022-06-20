import { container } from 'tsyringe';
import { iotDevice } from '../../../..';
import { CreateActionUseCase } from '../../../../useCases/data/Actions/CreateAction/CreateActionUseCase';
import { dateSaoPaulo } from '../../../../utils/convertTimeZoneDate';
import MessageQueue from '../../../../utils/message_queue';
import { messageErrorTryAction } from '../../../../utils/types';

class HandleCloudMessageTypeRaspberry {
  public static async receivedStatus(queue: MessageQueue, json: any) {
    if (json.payload) {
      console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
      queue.remove(json);
    } else {
      console.log('Status Changed Connection Received from Aws');
      console.log(json);
      console.log('........');
    }
  }

  public static async receivedAction(json: any) {
    const createActionUseCase = container.resolve(CreateActionUseCase);
    if (json.payload) {
      const { author, power, water, direction, percentimeter, timestamp } =
        json.payload;

      const newAction = {
        pivot_id: json.payload.pivot_id,
        author,
        power,
        water,
        direction,
        percentimeter
      };
      const newTimestamp = dateSaoPaulo(timestamp);

      try {
        await createActionUseCase.execute(newAction, newTimestamp, false);
        console.log(
          `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
        );
        iotDevice.publish(json);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          HandleCloudMessageTypeRaspberry.name,
          'Create Action'
        );
      }
    } else {
      console.log('Status Changed Connection Received from Aws');
      console.log(json);
      console.log('........');
      return false;
    }
  }
}

export { HandleCloudMessageTypeRaspberry };
