import { PivotModel } from '../../model/Pivot';
import { SchedulingAngleHistModel } from '../../model/SchedulingAngleHist';
import { UserModel } from '../../model/User'

interface ISchedulingAngleHistRepository {
  findByPivotId(
    pivot_id: PivotModel['pivot_id']
  ): Promise<SchedulingAngleHistModel[]>;

  findById(
    scheduling_angle_hist_id: SchedulingAngleHistModel['scheduling_angle_hist_id']
  ): Promise<SchedulingAngleHistModel | undefined>;

  findByUserId(author: UserModel['user_id']): Promise<SchedulingAngleHistModel[] | undefined>;

  getAllSchedulingsAngle(): Promise<SchedulingAngleHistModel[]>;

  create(
    scheduling_angle_hist: Omit<SchedulingAngleHistModel, 'scheduling_angle_hist_id'>
  ): Promise<SchedulingAngleHistModel | undefined>;

  delete(
    scheduling_angle_hist_id: SchedulingAngleHistModel['scheduling_angle_hist_id']
  ): Promise<SchedulingAngleHistModel | undefined>;

  update(
    scheduling_angle_hist: SchedulingAngleHistModel
  ): Promise<SchedulingAngleHistModel | undefined>;
}

export { ISchedulingAngleHistRepository };
