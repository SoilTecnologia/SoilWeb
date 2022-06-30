import { injectable } from 'tsyringe';
import { iotDevice } from '../../..';
import { checkGprsInterval } from '../../../aws-iot/data/utils/gprsChecking';

type Params = {
  pivots: string[];
};

@injectable()
class ReadStateUseCase {
  async execute({ pivots }: Params) {
    if (pivots && pivots.length > 0) {
      for (let pivot_id of pivots) {
        const payload = {
          payload: '000-000',
          type: 'status',
          id: pivot_id
        };

        iotDevice.publish(payload, pivot_id);
        setTimeout(async () => {
          await checkGprsInterval.checkResponseActive(pivot_id);
        }, 2000);
      }
      return 'OK';
    } else throw new Error('List does not pivots');
  }
}

export { ReadStateUseCase };
