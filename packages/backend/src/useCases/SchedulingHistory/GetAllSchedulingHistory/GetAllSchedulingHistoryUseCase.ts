import { inject, injectable } from 'tsyringe';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { dateString, dateStringAdd } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}
  private async applyQueryGetAllSchedulingHistory() {
    try {
      return await this.schedulingHistoryRepository.getAllSchedulings();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingHistoryUseCase.name,
        'GetAll Scheduling History'
      );
    }
  }
  async execute() {
    const allSchedullingHistory =
      await this.applyQueryGetAllSchedulingHistory();
    if (allSchedullingHistory && allSchedullingHistory.length > 0) {
      const schedulings = [];
      for (let schedule of allSchedullingHistory) {
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

export { GetAllSchedulingHistoryUseCase };
