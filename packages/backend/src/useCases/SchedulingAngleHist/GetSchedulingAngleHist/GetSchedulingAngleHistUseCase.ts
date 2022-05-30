import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryGetSchedule(id: string) {
    try {
      return await this.schedulingAngleHistRepository.findByPivotId(id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingAngleHistUseCase.name,
        'Get Schedule'
      );
    }
  }
  async execute(pivot_id: PivotModel['pivot_id']) {
    const getSchedulingAngleHist = await this.applyQueryGetSchedule(pivot_id);

    return getSchedulingAngleHist;
  }
}

export { GetSchedulingAngleHistUseCase };
