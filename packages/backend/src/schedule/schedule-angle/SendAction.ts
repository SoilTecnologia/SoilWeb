import schedule from 'node-schedule';
import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { CreateActionUseCase } from '../../useCases/Actions/CreateAction/CreateActionUseCase';
import { CreateAction } from '../../database/model/types/action';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { DeleteSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/DeleteSchedulingAngle/DeleteSchedulingAngleUseCase';
import { messageErrorTryAction } from '../../utils/types';
import emitter from '../../utils/eventBus';
import { ScheduleAngleEmitter } from '../protocols/scheduleEmitterType';
import {
  AngleDiferentprops,
  CallbackProps,
  JobSchedulingAngleModel
} from '../protocols';

class SendSchedulingAngle {
  private job: SchedulingAngleModel;
  private isPut: boolean;

  constructor({ scheduling, isPut }: ScheduleAngleEmitter) {
    this.job = scheduling;
    this.isPut = isPut;
  }

  private getOptionsDate(dateReceived: Date) {
    const newDate = dayjs(dateReceived)
      .subtract(1, 'month')
      .add(3, 'hour')
      .toDate();
    return newDate;
  }

  public async removeJob(schedule_id: string) {
    try {
      const isCancel = schedule.cancelJob(schedule_id);
      console.log(`Foi cancelado? ${isCancel ? 'SIM' : 'NÂo'}`);
      const deleteScheduleAngle = container.resolve(
        DeleteSchedulingAngleUseCase
      );
      await deleteScheduleAngle.execute(schedule_id);
      console.log('Agendamento Removido...');
      console.log('...');
    } catch (err) {
      messageErrorTryAction(err, false, SendSchedulingAngle.name, 'Remove Job');
    }
  }

  private configJob(date: Date, callback: CallbackProps) {
    try {
      const dateBow = new Date(Date.now() + 5000);
      const job = schedule.scheduleJob(
        this.job.scheduling_angle_id,
        date,
        callback.bind(null, {
          job: this.job
        })
      );

      console.log(job.name);
      console.log('....');
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingAngle.name}, configJob `);
      console.log(error.message);
      console.log('....');
    }
  }

  private async sendJob({ job }: JobSchedulingAngleModel) {
    // console.log(this.scheduleJob);
    const action: Omit<CreateAction, 'timestamp_sent'> = {
      pivot_id: job.pivot_id,
      author: job.author,
      power: job.power || false,
      water: job.water || false,
      direction: job.direction || 'CLOCKWISE',
      percentimeter: job.percentimeter || 0
    };

    try {
      console.log(`Iniciando ação por angulo agendada ...`);
      console.log('.....');

      emitter.on(
        `angle-changed-${job.pivot_id}`,
        (angle: AngleDiferentprops) => {
          this.listernerEmitter(job, angle);
        }
      );

      const createAction = container.resolve(CreateActionUseCase);
      await createAction.execute(action, job.timestamp, job.start_angle);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        SendSchedulingAngle.name,
        'Envio de Trabalho'
      );
    }
  }

  private async listernerEmitter(
    job: SchedulingAngleModel,
    angle: AngleDiferentprops
  ) {
    console.log('Nova alteração de angulo em ' + job.pivot_id);
    if (angle.newAngle >= job!!.end_angle!) {
      schedule.cancelJob(job.scheduling_angle_id);
      emitter.removeAllListeners(`angle-changed-${job.pivot_id}`);
      this.stopAction(job);
      console.log('Agendamentos finalizados');
    }
    console.log('....');
  }

  private async stopAction(job: SchedulingAngleModel) {
    try {
      this.removeJob(job.scheduling_angle_id);

      const action: Omit<CreateAction, 'timestamp_sent'> = {
        pivot_id: job.pivot_id,
        author: job.author,
        power: false,
        water: false,
        direction: 'CLOCKWISE',
        percentimeter: 0
      };

      console.log('Fim do Agendamento por angulo...');
      console.log(`Parando o pivo... ${job.pivot_id}`);
      const createAction = container.resolve(CreateActionUseCase);
      await createAction.execute(action, job.timestamp, job.start_angle);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        SendSchedulingAngle.name,
        'Remove SchedulingAngle'
      );
    }
  }

  async addListening() {
    const { timestamp } = this.job;
    if (this.isPut) this.removeJob(this.job.scheduling_angle_id);
    this.configJob(timestamp!!, this.sendJob);
  }
}

export { SendSchedulingAngle };
