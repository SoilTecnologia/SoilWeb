import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}

  private async applyQueryGetByPivot(pivot_id: string) {
    try {
      return await this.schedulingRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingUseCase.name,
        'Get Scheduling By Pivot Id'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getScheduling = await this.applyQueryGetByPivot(pivot_id);

    return getScheduling;
  }
}

export { GetSchedulingUseCase };
