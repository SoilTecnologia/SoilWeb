import { inject, injectable } from 'tsyringe';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { dateString, dateStringAdd } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

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

export { GetAllSchedulingUseCase };
