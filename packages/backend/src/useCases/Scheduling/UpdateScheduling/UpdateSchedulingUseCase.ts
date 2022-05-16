import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}

  private async applyQueryFindById(scheduling_id: string) {
    try {
      return await this.schedulingRepository.findById(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Get Scheduling By Id'
      );
    }
  }

  private async applyQueryUpdate(
    scheduling: Omit<SchedulingModel, 'timestamp'>
  ) {
    try {
      return await this.schedulingRepository.update(scheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Update Scheduling '
      );
    }
  }

  async execute(
    scheduling: Omit<SchedulingModel, 'timestamp'>,
    update_timestamp: Date
  ) {
    const getScheduling = await this.applyQueryFindById(
      scheduling.scheduling_id
    );

    if (!getScheduling) throw new Error('Schedulings Does Not Exists');

    const startDate = dayjs(getScheduling.start_timestamp);
    const nowDate = dayjs(update_timestamp).subtract(3, 'hour');

    dayjs.extend(isSameOrAfter);
    const dateIsAfter = dayjs(nowDate).isSameOrAfter(startDate);

    if (dateIsAfter) {
      return 'scheduling is running';
    } else {
      const newScheduling = await this.applyQueryUpdate({
        ...scheduling,
        start_timestamp: dayjs(scheduling.start_timestamp)
          .subtract(3, 'hour')
          .toDate(),
        end_timestamp: dayjs(scheduling.end_timestamp)
          .subtract(3, 'hour')
          .toDate()
      });

      if (newScheduling) {
        emitter.emit('scheduling', { scheduling: newScheduling, isPut: true });
      }

      return newScheduling;
    }
  }
}

export { UpdateSchedulingUseCase };
