import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../../database/model/User';
import { ISchedulingHistoryRepository } from '../../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetUserSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}

  private async applyQueryGetByUser(author: string) {
    try {
      return await this.schedulingHistoryRepository.findByUserId(author);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetUserSchedulingHistoryUseCase.name,
        'Get Scheduling History By User Id'
      );
    }
  }

  async execute(author: UserModel['password']) {
    const getUserSchedulingHistory = await this.applyQueryGetByUser(author);

    if (getUserSchedulingHistory && getUserSchedulingHistory.length > 0) {
      const schedulings = [];
      for (let schedule of getUserSchedulingHistory) {
        Object.assign(schedule, {
          ...schedule,
          start_timestamp: dateString(schedule.start_timestamp!),
          end_timestamp: dateString(schedule.end_timestamp!),
          timestamp: dateString(schedule.timestamp!)
        });

        schedulings.push(schedule);
      }

      return schedulings;
    } else return [];
  }
}

export { GetUserSchedulingHistoryUseCase };
