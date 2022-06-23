import { FarmModel } from '@root/database/model/Farm';

interface IGetOneFarmService {
  execute({ farm_id }: IGetOneFarmService.Params): IGetOneFarmService.Response;
}

namespace IGetOneFarmService {
  export type Params = { farm_id: string };
  export type Response = Promise<FarmModel | undefined>;
}

export { IGetOneFarmService };
