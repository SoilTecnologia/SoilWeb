import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { SchedulingHistoryModel } from '../../../database/model/SchedulingHistory';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import {
  dateIsAter,
  dateSaoPaulo
} from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository,
    @inject('SchedulingHistoryRepository')
    private schedulingHistory: ISchedulingHistoryRepository
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
      const schel = await this.schedulingRepository.update(scheduling);
      return schel;
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Update Scheduling '
      );
    }
  }

  private async applyQueryCreateHistory(
    scheduling: Omit<SchedulingHistoryModel, 'scheduling_history_id'>
  ) {
    try {
      return await this.schedulingHistory.create({
        ...scheduling,
        updated: scheduling.scheduling_id
      });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Create in History'
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

    const dateIsRuning = dateIsAter(
      getScheduling.start_timestamp!,
      update_timestamp
    );

    if (dateIsRuning) {
      console.log('Não é possivel atualizar, agendamento em execução...');
      return 'scheduling is running';
    } else {
      const newScheduling = await this.applyQueryUpdate({
        ...scheduling,
        start_timestamp: dateSaoPaulo(scheduling.start_timestamp!),
        end_timestamp: dateSaoPaulo(scheduling.end_timestamp!)
      });

      if (newScheduling) {
        type omitId =  Omit<SchedulingHistoryModel, 'scheduling_history_id'>
        const schedule: omitId = newScheduling
         
        delete schedule.scheduling_id;

        await this.applyQueryCreateHistory({
          ...schedule,
          updated: newScheduling.scheduling_id
        });
        emitter.emit('scheduling', { scheduling: newScheduling, isPut: true });
      }

      return newScheduling;
    }
  }
}

export { UpdateSchedulingUseCase };
