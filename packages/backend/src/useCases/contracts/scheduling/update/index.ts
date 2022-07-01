import { SchedulingModel } from '@root/database/model/Scheduling';

interface IUpdateSchedulingService {
  execute(
    scheduling: IUpdateSchedulingService.Params
  ): IUpdateSchedulingService.Response;
}

namespace IUpdateSchedulingService {
  export type Params = SchedulingModel;
  export type Response = Promise<SchedulingModel | undefined>;
}

export { IUpdateSchedulingService };
