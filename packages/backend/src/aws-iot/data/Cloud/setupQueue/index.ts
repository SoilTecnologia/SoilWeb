import { objectToActionString } from '../../../../raspberry/common/objectToActionString';
import emitter from '../../../../utils/eventBus';
import { handleResultString } from '../../../../utils/handleFarmIdWithUndescores';
import { ActionReceived } from '../../../protocols';
import { ProcessQueueMessages } from '../../utils/processQueue';
import { queueMessage } from '../../utils/QueueFactory';

class SetupQueueCloud {
  private processQueue: ProcessQueueMessages;

  constructor(pubTopic?: string) {
    this.processQueue = new ProcessQueueMessages('Cloud', pubTopic);
  }

  public listeningEmitter() {
    emitter.on('connection-pivot', async (action) => {
      queueMessage.enqueue({ type: 'status', ...action });
      this.processQueue.start();
      emitter.off('connection-pivot', () => {});
    });
    emitter.on('action', async (action: ActionReceived) => {
      console.log(action);
      const id = action.payload.pivot_id;
      const { node_num } = await handleResultString(id);

      // const pivotId = action.payload.pivot_id.split('_');
      if (action.is_gprs) {
        queueMessage.enqueue({
          type: 'action',
          id: `${action.farm_id}_${action.node_num}`,
          pivot_num: Number(node_num),
          payload: objectToActionString(
            action.payload.power,
            action.payload.water,
            action.payload.direction,
            action.payload.percentimeter,
            action.angle
          ),
          attempts: 1
        });
        console.log(`[EC2-IOT-ACTION] Adicionando mensagem à ser enviada`);
        emitter.off('action', () => {});
        this.processQueue.start();
      } else {
        const numId = action.node_num === 0 ? action.node_num : node_num;
        queueMessage.enqueue({
          type: 'action',
          id: `${action.farm_id}_${numId}`, // TODO status ta vindo node_num?
          pivot_num: Number(node_num),
          payload: { ...action.payload, angle: action.angle },
          attempts: 1
        });
        this.processQueue.start();
        emitter.off('action', () => {});
      }
    });
  }
}

export { SetupQueueCloud };
