import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { dateString, dateStringAdd } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  private async applyQueryGetSchedule(id: string) {
    try {
      return await this.schedulingAngleRepository.findByPivotId(id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingAngleUseCase.name,
        'Get Schedulings'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getSchedulingAngle = await this.applyQueryGetSchedule(pivot_id);
    if (getSchedulingAngle && getSchedulingAngle.length > 0) {
      const schedulings = [];
      for (let schedule of getSchedulingAngle) {
        Object.assign(schedule, {
          ...schedule,
          start_timestamp: dateStringAdd(schedule.start_timestamp!),
          timestamp: dateStringAdd(schedule.timestamp!)
        });

        schedulings.push(schedule);
      }

      return schedulings;
    } else return [];
  }
}

export { GetSchedulingAngleUseCase };
