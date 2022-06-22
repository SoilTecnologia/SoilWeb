import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleHistRepository } from '../../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetAllSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryGetSchedules() {
    try {
      return await this.schedulingAngleHistRepository.getAllSchedulingsAngle();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingAngleHistUseCase.name,
        'Get All Schedules'
      );
    }
  }
  async execute() {
    const AllSchedulingsAngleHist = await this.applyQueryGetSchedules();

    if (AllSchedulingsAngleHist && AllSchedulingsAngleHist.length > 0) {
      const schedulings = [];
      for (let schedule of AllSchedulingsAngleHist) {
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

export { GetAllSchedulingAngleHistUseCase };