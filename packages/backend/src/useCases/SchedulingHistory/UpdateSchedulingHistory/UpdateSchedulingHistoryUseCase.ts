import { inject, injectable } from 'tsyringe';
import { SchedulingHistoryModel } from '../../../database/model/SchedulingHistory';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}

  private async applyQueryFindById(scheduling_history_id: string) {
    try {
      return await this.schedulingHistoryRepository.findById(scheduling_history_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingHistoryUseCase.name,
        'Get Scheduling By Id'
      );
    }
  }

  private async applyQueryDelete(schedulingHistory: SchedulingHistoryModel) {
    try {
      return await this.schedulingHistoryRepository.update(schedulingHistory);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingHistoryUseCase.name,
        'Update Scheduling History'
      );
    }
  }

  async execute(schedulingHistory: SchedulingHistoryModel) {
    const getSchedulingHistory = await this.applyQueryFindById(
      schedulingHistory.scheduling_history_id
    );

    if (!getSchedulingHistory) throw new Error('Scheduling Historys Does Not Exists');

    const newSchedulingHistory = await this.applyQueryDelete(schedulingHistory);

    return newSchedulingHistory;
  }
}

export { UpdateSchedulingHistoryUseCase };
