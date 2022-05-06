import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';

@injectable()
class UpdateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  async execute(schedulingangle: SchedulingAngleModel) {
    const getSchedulingAngle = await this.schedulingAngleRepository.findById(
      schedulingangle.scheduling_angle_id
    );

    if (getSchedulingAngle) {
      const newSchedulingAngle = await this.schedulingAngleRepository.update(
        schedulingangle
      );

      return newSchedulingAngle;
    }
    throw new Error('Schedulings Angle Does Not Exists');
  }
}

export { UpdateSchedulingAngleUseCase };
