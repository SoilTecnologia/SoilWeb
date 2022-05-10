import { PivotModel } from '../../model/Pivot';
import { UserModel } from '../../model/User';
import { SchedulingHistoryModel } from '../../model/SchedulingHistory';

interface ISchedulingHistoryRepository {
  findByPivotId(pivot_id: PivotModel['pivot_id']): Promise<SchedulingHistoryModel[]>;

  findByUserId(user_id: UserModel['user_id']): Promise<SchedulingHistoryModel[]>;

  findById(
    scheduling_history_id: SchedulingHistoryModel['scheduling_history_id']
  ): Promise<SchedulingHistoryModel | undefined>;

  getAllSchedulings(): Promise<SchedulingHistoryModel[]>;

  create(
    scheduling_history: Omit<SchedulingHistoryModel, 'scheduling_history_id'>
  ): Promise<SchedulingHistoryModel | undefined>;

  delete(
    scheduling_history_id: SchedulingHistoryModel['scheduling_history_id']
  ): Promise<SchedulingHistoryModel | undefined>;

  update(scheduling_history: SchedulingHistoryModel): Promise<SchedulingHistoryModel | undefined>;
}

export { ISchedulingHistoryRepository };