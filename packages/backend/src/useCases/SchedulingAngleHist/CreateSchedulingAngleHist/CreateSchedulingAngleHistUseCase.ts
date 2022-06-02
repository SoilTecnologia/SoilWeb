import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { SchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/SchedulingAngleHistRepository';
import { dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: SchedulingAngleHistRepository
  ) {}

  private async applyQueryCreateScheduleAngle(
    schedule: SchedulingAngleHistModel
  ) {
    try {
      return await this.schedulingAngleHistRepository.create(schedule);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateSchedulingAngleHistUseCase.name,
        'Create Schedule Angle'
      );
    }
  }

  async execute(schedulinganglehist: SchedulingAngleHistModel) {

    Object.assign(schedulinganglehist,{
      ...schedulinganglehist,
      start_timestamp: dateSaoPaulo(schedulinganglehist.start_timestamp!),
      timestamp: dateSaoPaulo(schedulinganglehist.timestamp!)
    })
    
    const newSchedulingAngleHistData = await this.applyQueryCreateScheduleAngle(
      schedulinganglehist
    );

    return newSchedulingAngleHistData;
  }
}

export { CreateSchedulingAngleHistUseCase };
