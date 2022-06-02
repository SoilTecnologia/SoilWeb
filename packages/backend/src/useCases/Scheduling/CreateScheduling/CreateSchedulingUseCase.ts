import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { SchedulingHistoryModel } from '../../../database/model/SchedulingHistory';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import {  dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';
@injectable()
class CreateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository,
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
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

  private async applyQueryCreateHistory(
    scheduling: Omit<SchedulingHistoryModel, 'scheduling_history_id'>
  ) {
    try {
      return await this.schedulingHistoryRepository.create(scheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateSchedulingUseCase.name,
        'Create History'
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

    Object.assign(schedulingModel, {
      pivot_id,
      author,
      is_stop,
      power: is_stop ? false : power,
      water: is_stop ? false : water,
      direction: is_stop ? 'CLOCKWISE' : direction,
      percentimeter: is_stop ? 0 : percentimeter,
      start_timestamp: dateSaoPaulo(start_timestamp!),
      end_timestamp: dateSaoPaulo(end_timestamp!),
      timestamp: dateSaoPaulo(timestamp!)
    });

    const newScheduling = await this.applyQueryCreate(schedulingModel);

    if (newScheduling) {
      await this.applyQueryCreateHistory(schedulingModel);
      emitter.emit('scheduling', { scheduling: newScheduling, isPut: false });
    }

    return newScheduling;
  }
}

export { CreateSchedulingUseCase };
