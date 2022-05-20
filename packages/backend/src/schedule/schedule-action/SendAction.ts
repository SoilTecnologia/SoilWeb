import schedule from 'node-schedule';
import { SchedulingModel } from '../../database/model/Scheduling';
import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { DeleteSchedulingUseCase } from '../../useCases/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { CreateActionUseCase } from '../../useCases/Actions/CreateAction/CreateActionUseCase';
import { CreateAction } from '../../database/model/types/action';
import { messageErrorTryAction } from '../../utils/types';
import {
  CallbackProps,
  JobSchedulingModel,
  ScheduleEmitter
} from '../protocols/';

class SendSchedulingListening {
  private job: SchedulingModel;
  private isPut: boolean;

  constructor({ scheduling, isPut }: ScheduleEmitter) {
    this.job = scheduling;
    this.isPut = isPut;
  }

  private async removeJob(scheduling_id: string, delSchedule: boolean) {
    try {
      const isCancel = schedule.cancelJob(scheduling_id);
      console.log(`Foi cancelado? ${isCancel ? 'SIM' : 'NÂo'}`);
      //Excluindo do banco de dados
      if (delSchedule) {
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        SendSchedulingListening.name,
        'Remove Job'
      );
    }
  }

  private configJob(date: Date, callback: CallbackProps, id: string) {
    try {
      const scheduleName = `${this.job.scheduling_id}-${id}`;
      console.log(`Iniciando a schedule de nome ${scheduleName}`);
      schedule.scheduleJob(
        scheduleName,
        date,
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
      console.log(`Iniciando ação agendada as: ${job.start_timestamp}`);
      console.log('.....');
      const createActionUseCase = container.resolve(CreateActionUseCase);
      await createActionUseCase.execute(action, job.timestamp);
    } catch (err) {}
  }

  private async stopJob({ job }: JobSchedulingModel) {
    const deleteSchedule = container.resolve(DeleteSchedulingUseCase);

    try {
      const isCancel = schedule.cancelJob(`${job.scheduling_id}-start`);
      console.log(`Start Foi cancelado? ${isCancel ? 'SIM' : 'NÂo'}`);

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
        job.timestamp
      );

      const isCancelStop = await schedule.cancelJob(
        `${job.scheduling_id}-start`
      );
      console.log(`Stop Foi cancelado? ${isCancelStop ? 'SIM' : 'NÂo'}`);
      await deleteSchedule.execute(job.scheduling_id);
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name} of stopJob`);
      console.log(error);
      console.log('....');
    }
  }

  async addListening() {
    const { start_timestamp, end_timestamp, is_stop, scheduling_id } = this.job;

    if (this.isPut) {
      console.log('Recebido uma atualização de agendamento...');
      this.removeJob(scheduling_id, false);
    }
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
