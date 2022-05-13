import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';

@injectable()
class UpdateSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  async execute(schedulinganglehist: SchedulingAngleHistModel) {
    const getSchedulingAngle = await this.schedulingAngleHistRepository.findById(
      schedulinganglehist.scheduling_angle_hist_id
    );

    if (getSchedulingAngle) {
      const newSchedulingAngle = await this.schedulingAngleHistRepository.update(
        schedulinganglehist
      );

      return newSchedulingAngle;
    }
    throw new Error('Schedulings Angle Does Not Exists');
  }
}

export { UpdateSchedulingAngleHistUseCase };
