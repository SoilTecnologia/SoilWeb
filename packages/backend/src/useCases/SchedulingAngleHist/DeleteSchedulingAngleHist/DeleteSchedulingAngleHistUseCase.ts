import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingangleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryFindById(scheduling_id: string) {
    try {
      return await this.schedulingangleHistRepository.findById(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteSchedulingAngleHistUseCase.name,
        'Get Scheduling By Id'
      );
    }
  }

  private async applyQueryDelete(scheduling_id: string) {
    try {
      return await this.schedulingangleHistRepository.delete(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteSchedulingAngleHistUseCase.name,
        'Delete Scheduling '
      );
    }
  }
  async execute(
    scheduling_angle_hist_id: SchedulingAngleHistModel['scheduling_angle_hist_id']
  ) {
    const schedulinganglehist = await this.applyQueryFindById(
      scheduling_angle_hist_id
    );

    if (schedulinganglehist) {
      const schedulinganglehist = await this.applyQueryDelete(
        scheduling_angle_hist_id
      );

      return schedulinganglehist;
    }

    throw new Error('Scheduling Angle Hist does not exist');
  }
}

export { DeleteSchedulingAngleHistUseCase };
