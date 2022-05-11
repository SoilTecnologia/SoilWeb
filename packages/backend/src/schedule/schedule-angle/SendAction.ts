import schedule from 'node-schedule';
import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { CreateActionUseCase } from '../../useCases/Actions/CreateAction/CreateActionUseCase';
import { CreateAction } from '../../database/model/types/action';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { DeleteSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/DeleteSchedulingAngle/DeleteSchedulingAngleUseCase';
import { messageErrorTryAction } from '../../utils/types';
import emitter from '../../utils/eventBus';

type callbackProps = (job: any) => void;

type jobActionProps = {
  job: SchedulingAngleModel;
  scheduleObjectJob: schedule.Job;
};

type angleDiferentprops = {
  job: schedule.Job | undefined;
  oldAngle: number;
  newAlgle: number;
  pivot_id: string;
};

class SendSchedulingAngle {
  private job: SchedulingAngleModel;
  private scheduleJob: schedule.Job;

  constructor(newJob: SchedulingAngleModel) {
    this.job = newJob;
  }

  // private getOptionsDate(dateReceived: Date) {
  //   const newDate = dayjs(dateReceived)
  //     .subtract(1, 'month')
  //     .add(3, 'hour')
  //     .toDate();
  //   return newDate;
  // }

  private configJob(date: Date, callback: callbackProps) {
    try {
      const dateNow = new Date(Date.now() + 10000);
      const job = schedule.scheduleJob(
        this.job.scheduling_angle_id,
        dateNow,
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

  private static listernerEmitter(
    job: SchedulingAngleModel,
    angle: angleDiferentprops
  ) {
    console.log(
      `Pivot id ${job.pivot_id} recebeu alteração de angulo no agendamento`
    );
    if (angle.newAlgle >= job!!.end_angle!) {
      console.log('Finalizando job....');
      schedule.cancelJob(job.scheduling_angle_id);
      emitter.removeAllListeners(`angle-changed-${job.pivot_id}`);
      console.log('Jobs finalizados');
    }
  }

  private async sendJob({ job, scheduleObjectJob }: jobActionProps) {
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
        (angle: angleDiferentprops) => {
          SendSchedulingAngle.listernerEmitter(job, angle);
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

  private removeJob() {}
  async addListening() {
    const { timestamp } = this.job;
    const config = this.configJob(timestamp!!, this.sendJob);
    return config;
  }
}

export { SendSchedulingAngle };
