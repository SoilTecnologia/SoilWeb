import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { SchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/SchedulingAngleHistRepository';

@injectable()
class CreateSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: SchedulingAngleHistRepository
  ) {}

  async execute(schedulinganglehist: SchedulingAngleHistModel) {
    const {
      scheduling_angle_hist_id,
      pivot_id,
      is_return,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      start_timestamp,
      timestamp
    } = schedulinganglehist;

    const schedulingAngleHistModel = new SchedulingAngleHistModel();

    const newTimeStamp = dayjs(timestamp).subtract(3, 'hour');
    const newStartTimeStamp = dayjs(start_timestamp).subtract(3, 'hour');

    Object.assign(schedulingAngleHistModel, {
      scheduling_angle_hist_id,
      pivot_id,
      is_return,
      author,
      power: is_return ? false : power,
      water: is_return ? false : water,
      direction: is_return ? 'CLOCKWISE' : direction,
      percentimeter: is_return ? 0 : percentimeter,
      start_angle: is_return ? 0 : start_angle,
      end_angle: is_return ? 0 : end_angle,
      start_timestamp: newStartTimeStamp,
      timestamp: newTimeStamp
    });

    const newSchedulingAngleHistData =
      await this.schedulingAngleHistRepository.create(schedulingAngleHistModel);

    return newSchedulingAngleHistData;
  }
}

export { CreateSchedulingAngleHistUseCase };
