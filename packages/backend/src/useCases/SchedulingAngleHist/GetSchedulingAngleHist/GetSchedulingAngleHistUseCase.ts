import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateString } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryGetSchedule(id: string) {
    try {
      return await this.schedulingAngleHistRepository.findByPivotId(id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingAngleHistUseCase.name,
        'Get Schedule'
      );
    }
  }
  async execute(pivot_id: PivotModel['pivot_id']) {
    const getSchedulingAngleHist = await this.applyQueryGetSchedule(pivot_id);

    if(getSchedulingAngleHist && getSchedulingAngleHist.length > 0){
      const schedulings = []
      for(let schedule of getSchedulingAngleHist){
        Object.assign(schedule, {
          ...schedule,
          start_timestamp: dateString(schedule.start_timestamp!),
          timestamp: dateString(schedule.timestamp!)
        })

        schedulings.push(schedule)
      }

      return schedulings;
    }
    else return []
  }
}

export { GetSchedulingAngleHistUseCase };
