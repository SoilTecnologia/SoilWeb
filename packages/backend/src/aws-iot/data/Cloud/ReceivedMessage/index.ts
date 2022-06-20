import { container } from 'tsyringe';
import { GetPivotByIdUseCase } from '@useCases/data/Pivots/GetById/GetByIdUseCase';
import { handleResultString } from '@utils/handleFarmIdWithUndescores';
import MessageQueue from '@utils/message_queue';
import { messageErrorTryAction } from '@utils/types';
import { socketIo } from '@utils/socketIo';
import { handleGateway } from './gateway';
import { handleGprs } from './gprs';

type handleCloudProps = {
  pivot_id: string;
  payload: any;
  node_num: string;
};

class HandleCloudMessageTypeCloud {
  public static async receivedStatus({
    pivot_id,
    payload,
    node_num
  }: handleCloudProps) {
    const getPivotUseCase = container.resolve(GetPivotByIdUseCase);
    // Se possui um pivot_num, é um concentrador
    // Caso contrário podemos assumir que é um GPRS
    try {
      const pivotExists = await getPivotUseCase.execute(pivot_id);
      if (pivotExists) {
        if (node_num === '0') await handleGateway(payload, pivot_id);
        else await handleGprs(payload, pivot_id);
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        HandleCloudMessageTypeCloud.name,
        'Received Status'
      );
      return false;
    }
  }

  public static async receivedAction(json: any, queue: MessageQueue) {
    queue.remove(json);
    console.log('[EC2-IOT-ACTION-ACK] Resposta de status recebida');
    socketIo('ackReceived', json);
  }
}

export { HandleCloudMessageTypeCloud };
