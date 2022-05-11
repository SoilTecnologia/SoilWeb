import dayjs from 'dayjs';  
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { SchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/SchedulingAngleRepository';

@injectable()
class CreateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: SchedulingAngleRepository
  ) {}

  async execute(
    schedulingangle: Omit<SchedulingAngleModel, 'scheduling_angle_id'>
  ) {
    const {
      pivot_id,
      is_return,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      timestamp
    } = schedulingangle;

    const schedulingAngleModel = new SchedulingAngleModel();

    const newTimeStamp = dayjs(timestamp).subtract(3, 'hour');

    Object.assign(schedulingAngleModel, {
      pivot_id,
      is_return,
      author,
      power: is_return ? false : power,
      water: is_return ? false : water,
      direction: is_return ? 'CLOCKWISE' : direction,
      percentimeter: is_return ? 0 : percentimeter,
      start_angle: is_return ? 0 : start_angle,
      end_angle:is_return ? 0 : end_angle,
      timestamp: newTimeStamp
    });

    const newSchedulingAngleData = await this.schedulingAngleRepository.create(
      schedulingAngleModel
    );

    return newSchedulingAngleData;
  }
}

export { CreateSchedulingAngleUseCase };
