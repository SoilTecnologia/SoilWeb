import { SchedulingModel } from '@root/database/model/Scheduling';

interface IGetOneSchedulingService {
  execute({
    scheduling_id
  }: IGetOneSchedulingService.Params): IGetOneSchedulingService.Response;
}

namespace IGetOneSchedulingService {
  export type Params = { scheduling_id: string };
  export type Response = Promise<SchedulingModel | undefined>;
}

export { IGetOneSchedulingService };
