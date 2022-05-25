import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQuerFindScheduling(id: string) {
    try {
      return await this.schedulingAngleHistRepository.findById(id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingAngleHistUseCase.name,
        'Update Schedule'
      );
    }
  }

  private async applyQuerUpdateScheduling(schedule: SchedulingAngleHistModel) {
    try {
      return await this.schedulingAngleHistRepository.update(schedule);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingAngleHistUseCase.name,
        'Update Schedule'
      );
    }
  }
  async execute(schedule: SchedulingAngleHistModel) {
    const getSchedulingAngle = await this.applyQuerFindScheduling(
      schedule.scheduling_angle_hist_id
    );

    if (getSchedulingAngle) {
      const newSchedulingAngle = await this.applyQuerUpdateScheduling(schedule);

      return newSchedulingAngle;
    }
    throw new Error('Schedulings Angle Does Not Exists');
  }
}

export { UpdateSchedulingAngleHistUseCase };
