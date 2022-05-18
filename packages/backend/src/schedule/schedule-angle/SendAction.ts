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
import { GetStateVariableUseCase } from '../../useCases/StateVariable/GetStateVariable/GetStateVariableUseCase';

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

  public static async removeJob(schedule_id: string) {
    try {
      schedule.cancelJob(schedule_id);
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

      schedule.scheduleJob(
        this.job.scheduling_angle_id,
        dateBow,
        callback.bind(null, {
          job: this.job
        })
      );
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingAngle.name}, configJob `);
      console.log(error.message);
      console.log('....');
    }
  }

  private async sendJob({ job }: JobSchedulingAngleModel) {
    // console.log(this.scheduleJob);
    try {
      const stateRepository = container.resolve(GetStateVariableUseCase);
      const actualState = await stateRepository.execute(job.pivot_id);

      // Checa se o angulo atual é diferente do angulo start_angulo,
      // se for primeiro temos que retornar o pivo para start angulo,
      // para só então iniciar o agendamento...

      if (!actualState || actualState.angle === job.start_angle) {
        await SendSchedulingAngle.initActionForEndAngle(job);
      } else {
        await SendSchedulingAngle.initActionForStartAngle(job);
      }
    } catch (err) {
      messageErrorTryAction(err, false, SendSchedulingAngle.name, 'SendJob');
    }
  }

  private static async initActionForStartAngle(job: SchedulingAngleModel) {
    const action = {
      pivot_id: job.pivot_id,
      author: job.author,
      power: true,
      water: false,
      direction: job.direction || 'CLOCKWISE',
      percentimeter: 100
    };
    const createAction = container.resolve(CreateActionUseCase);

    await createAction.execute(action, new Date(), job.start_angle);
    emitter.on(
      `angle-changed-${job.pivot_id}`,
      async (angle: AngleDiferentprops) => {
        await SendSchedulingAngle.listernerEmitter(job, angle, 'start');
      }
    );
  }

  private static async initActionForEndAngle(job: SchedulingAngleModel) {
    emitter.removeAllListeners(`angle-changed-${job.pivot_id}`);
    const action: Omit<CreateAction, 'timestamp_sent'> = {
      pivot_id: job.pivot_id,
      author: job.author,
      power: job.power || false,
      water: job.water || false,
      direction: job.direction || 'CLOCKWISE',
      percentimeter: job.percentimeter || 0
    };
    emitter.on(`angle-changed-${job.pivot_id}`, (angle: AngleDiferentprops) => {
      SendSchedulingAngle.listernerEmitter(job, angle, 'end');
    });
    const createAction = container.resolve(CreateActionUseCase);

    await createAction.execute(action, job.timestamp, job.end_angle);
  }

  private static async listernerEmitter(
    job: SchedulingAngleModel,
    angle: AngleDiferentprops,
    startOrEndAngle: 'start' | 'end'
  ) {
    console.log('Nova alteração de angulo em ' + job.pivot_id);
    if (startOrEndAngle === 'end') {
      const startAngleGrantedEndAngle = job.start_angle! > job.end_angle!;
      const newAngleGrantedEndAngle = angle.newAngle >= job.end_angle!;

      // Checagem  se o start angle for maior que enf angle quer dizer que o pivo
      // está retornando, com isso o angulo atual tem que ser menor ou igual ao
      // end_angle já que o pivo está indo de 360 a 0 com isso ele subtractAngle,
      // se o  start_angle for  menor ele está indo de 0 a 360 por isso addAngle.

      const subtractAngle =
        startAngleGrantedEndAngle && !newAngleGrantedEndAngle;
      const addAngle = !startAngleGrantedEndAngle && newAngleGrantedEndAngle;

      if (subtractAngle || addAngle) {
        emitter.removeAllListeners(`angle-changed-${job.pivot_id}`);
        SendSchedulingAngle.stopAction(job);
        console.log('Agendamentos finalizados');
      }
    } else {
      const oldAngleGrantedNewAngle = angle.oldAngle < angle.newAngle;
      const newAngleGrantedStartAngle = angle.newAngle >= job.start_angle!;

      // Checa se o angulo antigo é maior que o novo angulo  quer dizer que o pivo
      // está indo de 0 a 360 para chegar ao start angulo, então o novo angulo
      // tem que maior ou igual ao start angulo para iniciar o agendamento.
      // Se o angulo antigo for menor que o novo angulo quer dizer que
      // o pivo está indo de 360 a 0 para chegar ao start angulo, então o novo
      // angulo precisa ser menor ou igual ao start angulo para iniciar o agendamento

      const subtractAngle =
        !oldAngleGrantedNewAngle && newAngleGrantedStartAngle;
      const addAngle = oldAngleGrantedNewAngle && !newAngleGrantedStartAngle;

      if (subtractAngle || addAngle)
        await SendSchedulingAngle.initActionForEndAngle(job);
    }

    console.log('....');
  }

  private static async stopAction(job: SchedulingAngleModel) {
    try {
      const createAction = container.resolve(CreateActionUseCase);

      SendSchedulingAngle.removeJob(job.scheduling_angle_id);

      const action: Omit<CreateAction, 'timestamp_sent'> = {
        pivot_id: job.pivot_id,
        author: job.author,
        power: job.is_return ? true : false,
        water: false,
        direction: job.direction || 'CLOCKWISE',
        percentimeter: job.is_return ? 100 : 0
      };

      console.log(`Fim do Agendamento por angulo... No pivo ${job.pivot_id}`);
      await createAction.execute(
        action,
        job.timestamp,
        job.start_angle,
        job.end_angle
      );
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
    if (this.isPut) SendSchedulingAngle.removeJob(this.job.scheduling_angle_id);
    this.configJob(timestamp!!, this.sendJob);
  }
}

export { SendSchedulingAngle };
