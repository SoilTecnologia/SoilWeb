import { queueMessage } from '../QueueFactory';
import { iotDevice } from '../../../..';
import emitter from '../../../../utils/eventBus';
import { checkGprsInterval } from '../gprsChecking';
import { emitterResponse } from '../gprsChecking/emitterResponse';

type typeProject = 'Raspberry' | 'Cloud';

class ProcessQueueMessages {
  private type: typeProject;
  private pubTopic: string | undefined;

  constructor(type: typeProject, pubTopic?: string) {
    this.type = type;
    pubTopic && this.pubTopic;
  }

  async start() {
    if (!queueMessage.isEmpty()) {
      // Ready serve para parar qualquer outro loop de acessar a queue enquanto acessamos aqui

      for (const queue of queueMessage._store) {
        if (queue.attempts && queue.attempts > 3) {
          console.log('[REMOVING ACTION FROM QUEUE] - Too Many Attempts');
          emitter.emit('action-ack-not-received', queue);

          console.log('');
          console.log(
            '              ACK not received in Action...             '
          );
          queueMessage.remove(queue);
        } else {
          try {
            const raspOrCloud =
              this.type === 'Raspberry' && this.pubTopic
                ? this.pubTopic
                : queue.id;
            queueMessage.remove(queue);

            iotDevice.publish(queue, raspOrCloud);
            setTimeout(async () => {
              if (queue.type === 'status' && this.type === 'Cloud') {
                await checkGprsInterval.checkResponseActive(queue.id);
              } else if (queue.type === 'action') {
                await emitterResponse.start(queue.id);
              }
            }, 5000);
          } catch (err) {
            console.log('ERROR AWS publish');
            console.log(err.message);
            queue.attempts!!++;
            if (queue.attempts!! > 3) {
              console.log('Error to received ACK');
              queueMessage.remove(queue);
            } else {
              const currentQueue = queueMessage.dequeue()!;
              queueMessage.enqueue(currentQueue);
            }
          }
        }
      }
    }

    setTimeout(async () => {
      await this.start();
    }, 10000);
  }
}

export { ProcessQueueMessages };
