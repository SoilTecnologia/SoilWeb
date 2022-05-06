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

    Object.assign(schedulingAngleModel, {
      pivot_id,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      timestamp
    });

    const newSchedulingAngleData = await this.schedulingAngleRepository.create(
      schedulingAngleModel
    );

    return newSchedulingAngleData;
  }
}

export { CreateSchedulingAngleUseCase };
