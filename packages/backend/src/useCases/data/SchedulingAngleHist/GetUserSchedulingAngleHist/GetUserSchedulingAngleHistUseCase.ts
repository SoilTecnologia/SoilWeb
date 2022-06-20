import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../../database/model/User';
import { ISchedulingAngleHistRepository } from '../../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetUserSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryGetByUser(author: string) {
    try {
      return await this.schedulingAngleHistRepository.findByUserId(author);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetUserSchedulingAngleHistUseCase.name,
        'Get Scheduling Angle History By User Id'
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
          timestamp: dateString(schedule.timestamp!)
        });

        schedulings.push(schedule);
      }

      return schedulings;
    } else return [];
  }
}

export { GetUserSchedulingAngleHistUseCase };
