import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingHistoryModel } from '../../../database/model/SchedulingHistory';
import { SchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/SchedulingHistoryRepository';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';
@injectable()
class CreateSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: SchedulingHistoryRepository
  ) {}

  private async applyQueryCreate(schedulingHistory: SchedulingHistoryModel) {
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

  async execute(schedulingHistory: Omit<SchedulingHistoryModel, 'scheduling_history_id'>) {
    const {
      is_stop,
      pivot_id,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = schedulingHistory;
    const schedulingHistoryModel = new SchedulingHistoryModel();

    const newStartTimeStamp = dayjs(start_timestamp).subtract(3, 'hour');
    const newEndTimeStamp = dayjs(end_timestamp).subtract(3, 'hour');
    const newTimeStamp = dayjs(timestamp).subtract(3, 'hour');

    Object.assign(schedulingHistoryModel, {
      pivot_id,
      author,
      is_stop,
      power: is_stop ? false : power,
      water: is_stop ? false : water,
      direction: is_stop ? 'CLOCKWISE' : direction,
      percentimeter: is_stop ? 0 : percentimeter,
      start_timestamp: newStartTimeStamp,
      end_timestamp: newEndTimeStamp,
      timestamp: newTimeStamp
    });

    const newSchedulingHistory = await this.applyQueryCreate(schedulingHistoryModel);
    if (newSchedulingHistory) {
      emitter.emit('schedulingHistory', newSchedulingHistory);
    }

    return newSchedulingHistory;
  }
}

export { CreateSchedulingHistoryUseCase };
