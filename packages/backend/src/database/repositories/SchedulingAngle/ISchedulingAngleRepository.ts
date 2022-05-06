import { PivotModel } from '../../model/Pivot';
import { SchedulingAngleModel } from '../../model/SchedulingAngle';

interface ISchedulingAngleRepository {
  findByPivotId(
    pivot_id: PivotModel['pivot_id']
  ): Promise<SchedulingAngleModel[]>;

  findById(
    scheduling_angle_id: SchedulingAngleModel['scheduling_angle_id']
  ): Promise<SchedulingAngleModel | undefined>;

  getAllSchedulingsAngle(): Promise<SchedulingAngleModel[]>;

  create(
    schedulingangle: Omit<SchedulingAngleModel, 'scheduling_angle_id'>
  ): Promise<SchedulingAngleModel | undefined>;

  delete(
    scheduling_angle_id: SchedulingAngleModel['scheduling_angle_id']
  ): Promise<SchedulingAngleModel | undefined>;

  update(
    schedulingangle: SchedulingAngleModel
  ): Promise<SchedulingAngleModel | undefined>;
}

export { ISchedulingAngleRepository };
