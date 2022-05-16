import { queueMessage } from '../..';
import emitter from '../../../../../utils/eventBus';
import { ProcessQueueMessages } from '../../processQueue';

class SetupQueueRaspberry {
  private processQueue: ProcessQueueMessages;

  constructor(pubTopic?: string) {
    this.processQueue = new ProcessQueueMessages('Raspberry', pubTopic);
  }

  public listeningEmitter() {
    emitter.on('status', (status) => {
      console.log(
        `Emitter Status Raspberry: ${JSON.stringify(status, null, 2)}`
      );
      const idStrip: string[] = status.payload.pivot_id.split('_');
      const pivot_num = Number(idStrip.pop());

      queueMessage.enqueue({
        type: 'status',
        id: `${status.farm_id}_${status.node_num}`, // TODO status ta vindo node_num?
        pivot_num,
        payload: {
          ...status.payload,
          timestamp: status.payload.timestamp.toString()
        },
        attempts: 1
      });

      console.log(`[RASPBERRY-IOT-STATUS] Adicionando mensagem à ser enviada`);
      this.processQueue.start();
      emitter.off('status', () => {});
    });

    emitter.on('connection-pivot', async (action) => {
      queueMessage.enqueue({ type: 'status', ...action });
      this.processQueue.start();
      emitter.off('connection-pivot', () => {});
    });
  }
}

export { SetupQueueRaspberry };
