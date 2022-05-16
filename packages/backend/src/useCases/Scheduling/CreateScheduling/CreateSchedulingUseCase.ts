import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { SchedulingRepository } from '../../../database/repositories/Scheduling/SchedulingRepository';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';
@injectable()
class CreateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: SchedulingRepository
  ) {}

  private async applyQueryCreate(scheduling: SchedulingModel) {
    try {
      return await this.schedulingRepository.create(scheduling);
    } catch (err) {
      console.log(err);

      messageErrorTryAction(
        err,
        true,
        CreateSchedulingUseCase.name,
        'CreateSchedulling'
      );
    }
  }

  async execute(scheduling: Omit<SchedulingModel, 'scheduling_id'>) {
    const {
      is_stop,
      pivot_id,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = scheduling;
    const schedulingModel = new SchedulingModel();

    const newStartTimeStamp = dayjs(start_timestamp).subtract(3, 'hour');
    const newEndTimeStamp = dayjs(end_timestamp).subtract(3, 'hour');
    const newTimeStamp = dayjs(timestamp).subtract(3, 'hour');

    Object.assign(schedulingModel, {
      pivot_id,
      author,
      is_stop,
      power: is_stop ? false : power,
      water: is_stop ? false : water,
      direction: is_stop ? 'CLOCKWISE' : direction,
      percentimeter: is_stop ? 0 : percentimeter,
      start_timestamp: newStartTimeStamp,
      end_timestamp: newEndTimeStamp,
      timestamp: newTimeStamp
    });

    const newScheduling = await this.applyQueryCreate(schedulingModel);
    if (newScheduling) {
      emitter.emit('scheduling', { scheduling: newScheduling, isPut: false });
    }

    return newScheduling;
  }
}

export { CreateSchedulingUseCase };
