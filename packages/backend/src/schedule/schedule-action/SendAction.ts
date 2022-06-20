import schedule from 'node-schedule';
import { SchedulingModel } from '../../database/model/Scheduling';
import { container } from 'tsyringe';
import { DeleteSchedulingUseCase } from '../../useCases/data/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { CreateActionUseCase } from '../../useCases/data/Actions/CreateAction/CreateActionUseCase';
import { CreateAction } from '../../database/model/types/action';
import {
  CallbackProps,
  JobSchedulingModel,
  ScheduleEmitter
} from '../protocols/';
import { dateRuleSchedule } from '../utils/dateUtils';
import { messageErrorTryAction } from '../../utils/types';
import { scheduleFactory } from '../protocols/scheduleFactory';

class SendSchedulingListening {
  private job: SchedulingModel;
  private isPut: boolean;

  constructor({ scheduling, isPut }: ScheduleEmitter) {
    this.job = scheduling;
    this.isPut = isPut;
  }

  private configJob(date: Date, callback: CallbackProps, id: string) {
    try {
      const rule = dateRuleSchedule(date);
      const scheduleName = `${this.job.scheduling_id}-${id}`;

      console.log(`Configurando o agendamento de nome ${scheduleName}`);
      scheduleFactory.scheduleJob(
        scheduleName,
        rule,
        callback.bind(null, {
          job: this.job
        })
      );
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name}, configJob `);
      console.log(error.message);
      console.log('....');
    }
  }

  private async sendJob({ job }: JobSchedulingModel) {
    const action: Omit<CreateAction, 'timestamp_sent'> = {
      pivot_id: job.pivot_id,
      author: job.author,
      power: job.power || false,
      water: job.water || false,
      direction: job.direction || 'CLOCKWISE',
      percentimeter: job.percentimeter || 0
    };
    try {
      console.log('.....');
      const createActionUseCase = container.resolve(CreateActionUseCase);
      await createActionUseCase.execute(action, job.timestamp, true);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        SendSchedulingListening.name,
        'Send Job'
      );
    }
  }

  private async stopJob({ job }: JobSchedulingModel) {
    const deleteSchedule = container.resolve(DeleteSchedulingUseCase);
    try {
      scheduleFactory.cancelJob(`${job.scheduling_id}-start`);
      scheduleFactory.cancelJob(`${job.scheduling_id}-stop`);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        SendSchedulingListening.name,
        'Cancel Job'
      );
    }

    try {
      await deleteSchedule.execute(job.scheduling_id);

      const createActionUseCase = container.resolve(CreateActionUseCase);
      // Desliga o estado
      await createActionUseCase.execute(
        {
          pivot_id: job.pivot_id,
          author: job.author,
          power: false,
          water: false,
          direction: 'CLOCKWISE',
          percentimeter: 0
        },
        job.timestamp,
        true
      );
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name} of stopJob`);
      console.log(error);
      console.log('....');
    }
  }

  async addListening() {
    const { start_timestamp, end_timestamp, is_stop } = this.job;

    // Enviar para iniciar o agendamento
    if (is_stop) {
      this.configJob(end_timestamp!!, this.stopJob, 'stop');
    } else {
      this.configJob(start_timestamp!!, this.sendJob, 'start');
      this.configJob(end_timestamp!!, this.stopJob, 'stop');
    }
  }
}

export { SendSchedulingListening };
