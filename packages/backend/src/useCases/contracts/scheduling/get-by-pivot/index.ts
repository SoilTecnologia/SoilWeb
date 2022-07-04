import { SchedulingModel } from '@root/database/model/Scheduling';

interface IGetSchedulingByPivotService {
  execute({
    pivot_id
  }: IGetSchedulingByPivotService.Params): IGetSchedulingByPivotService.Response;
}

namespace IGetSchedulingByPivotService {
  export type Params = { pivot_id: string };
  export type Response = Promise<SchedulingModel[] | undefined>;
}

export { IGetSchedulingByPivotService };
