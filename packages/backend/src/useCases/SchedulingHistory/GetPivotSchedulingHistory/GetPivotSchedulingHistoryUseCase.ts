import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetPivotSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}

  private async applyQueryGetByPivot(pivot_id: string) {
    try {
      return await this.schedulingHistoryRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetPivotSchedulingHistoryUseCase.name,
        'Get Scheduling History By Pivot Id'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getSchedulingHistory = await this.applyQueryGetByPivot(pivot_id);

    return getSchedulingHistory;
  }
}

export { GetPivotSchedulingHistoryUseCase };
