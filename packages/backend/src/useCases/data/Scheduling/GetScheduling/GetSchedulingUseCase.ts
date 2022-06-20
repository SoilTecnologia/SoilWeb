import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../../database/model/Pivot';
import { SchedulingModel } from '../../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../../database/repositories/Scheduling/ISchedulingRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}

  private async applyQueryGetByPivot(pivot_id: string) {
    try {
      return await this.schedulingRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingUseCase.name,
        'Get Scheduling By Pivot Id'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getScheduling = await this.applyQueryGetByPivot(pivot_id);

    if (getScheduling && getScheduling.length > 0) {
      const schedulings = [];
      for (let schedule of getScheduling) {
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

export { GetSchedulingUseCase };
