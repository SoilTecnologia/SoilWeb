import { inject, injectable } from 'tsyringe';
import { ISchedulingRepository } from '../../../../database/repositories/Scheduling/ISchedulingRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetAllSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}

  private async applyQueryGetAllScheduling() {
    try {
      return await this.schedulingRepository.getAllSchedulings();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingUseCase.name,
        'GetAll Scheduling'
      );
    }
  }
  async execute() {
    const allSchedulings = await this.applyQueryGetAllScheduling();
    if (allSchedulings && allSchedulings.length > 0) {
      const schedulings = [];
      for (let schedule of allSchedulings) {
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

export { GetAllSchedulingUseCase };
