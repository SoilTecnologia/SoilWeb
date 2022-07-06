import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { dateString, dateStringAdd } from '../../../utils/convertTimeZoneDate';
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

    if (getSchedulingHistory && getSchedulingHistory.length > 0) {
      const schedulings = [];
      for (let schedule of getSchedulingHistory) {
        Object.assign(schedule, {
          ...schedule,
          start_timestamp: dateStringAdd(schedule.start_timestamp!),
          end_timestamp: dateStringAdd(schedule.end_timestamp!),
          timestamp: dateStringAdd(schedule.timestamp!)
        });

        schedulings.push(schedule);
      }

      return schedulings;
    } else return [];
  }
}

export { GetPivotSchedulingHistoryUseCase };
