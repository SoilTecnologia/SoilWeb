import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';

@injectable()
class DeleteSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingangleHistRepository: ISchedulingAngleHistRepository
  ) {}

  async execute(
    scheduling_angle_hist_id: SchedulingAngleHistModel['scheduling_angle_hist_id']
  ) {
    const schedulinganglehist = await this.schedulingangleHistRepository.findById(
      scheduling_angle_hist_id
    );

    if (schedulinganglehist) {
      const schedulinganglehist = await this.schedulingangleHistRepository.delete(
        scheduling_angle_hist_id
      );

      return schedulinganglehist;
    }

    throw new Error('Scheduling Angle Hist does not exist');
  }
}

export { DeleteSchedulingAngleHistUseCase };
