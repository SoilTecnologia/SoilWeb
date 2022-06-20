import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleRepository } from '../../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetAllSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  private async applyQueryGetSchedule() {
    try {
      return await this.schedulingAngleRepository.getAllSchedulingsAngle();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingAngleUseCase.name,
        'Get Schedulings'
      );
    }
  }

  async execute() {
    const AllSchedulingsAngle = await this.applyQueryGetSchedule();

    if (AllSchedulingsAngle && AllSchedulingsAngle.length > 0) {
      const schedulings = [];
      for (let schedule of AllSchedulingsAngle) {
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

export { GetAllSchedulingAngleUseCase };
