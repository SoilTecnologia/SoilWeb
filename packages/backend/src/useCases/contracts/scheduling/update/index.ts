import { SchedulingModel } from '@root/database/model/Scheduling';

type timestampProps = { update_timestamp: Date };
type OmitScheduling = Omit<SchedulingModel, 'timestamp'>;
interface IUpdateSchedulingService {
  execute(
    scheduling: IUpdateSchedulingService.Params
  ): IUpdateSchedulingService.Response;
}

namespace IUpdateSchedulingService {
  export type Params = OmitScheduling & timestampProps;
  export type Response = Promise<
    SchedulingModel | undefined | { message: 'scheduling is running' }
  >;
}

export { IUpdateSchedulingService };
