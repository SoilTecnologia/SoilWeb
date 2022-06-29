import { injectable } from 'tsyringe';
import { iotDevice } from '../../..';
import { checkGprsInterval } from '../../../aws-iot/data/utils/gprsChecking';

type Params = {
  pivot_id: string;
};

@injectable()
class ReadStateUseCase {
  async execute({ pivot_id }: Params) {
    const payload = {
      payload: '000-000',
      type: 'status',
      id: pivot_id
    };

    iotDevice.publish(payload, pivot_id);

    setTimeout(async () => {
      await checkGprsInterval.checkResponseActive(pivot_id);
    }, 2000);

    return 'OK';
  }
}

export { ReadStateUseCase };
