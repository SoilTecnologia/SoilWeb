import { SchedulingModel } from '@root/database/model/Scheduling';

interface IGetAllSchedulingService {
  execute(): IGetAllSchedulingService.Response;
}

namespace IGetAllSchedulingService {
  export type Response = Promise<SchedulingModel[] | undefined>;
}

export { IGetAllSchedulingService };
