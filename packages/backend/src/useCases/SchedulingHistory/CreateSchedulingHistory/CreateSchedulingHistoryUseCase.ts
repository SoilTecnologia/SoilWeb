import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingHistoryModel } from '../../../database/model/SchedulingHistory';
import { SchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/SchedulingHistoryRepository';
import { dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';
@injectable()
class CreateSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: SchedulingHistoryRepository
  ) {}

  private async applyQueryCreate(schedulingHistory: Omit<SchedulingHistoryModel, "scheduling_history_id">) {
    try {
      return await this.schedulingHistoryRepository.create(schedulingHistory);
    } catch (err) {
      console.log(err);

      messageErrorTryAction(
        err,
        true,
        CreateSchedulingHistoryUseCase.name,
        'CreateSchedullingHistory'
      );
    }
  }

  async execute(
    schedulingHistory: Omit<SchedulingHistoryModel, 'scheduling_history_id'>
  ) {    
    const newSchedulingHistory = await this.applyQueryCreate(
      schedulingHistory
    );

    return newSchedulingHistory;
  }
}

export { CreateSchedulingHistoryUseCase };
