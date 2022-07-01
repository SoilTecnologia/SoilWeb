import { SchedulingModel } from '@root/database/model/Scheduling';

interface ICreateSchedulingService {
  execute(
    scheduling: ICreateSchedulingService.Params
  ): ICreateSchedulingService.Response;
}

namespace ICreateSchedulingService {
  export type Params = Omit<SchedulingModel, 'scheduling_id'>;
  export type Response = Promise<SchedulingModel | undefined>;
}

export { ICreateSchedulingService };
