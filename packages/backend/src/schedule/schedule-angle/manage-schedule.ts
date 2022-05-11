import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { GetAllSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/GetAllSchedulingAngle/GetAllSchedulingAngleUseCase';
import emitter from '../../utils/eventBus';
import { messageErrorTryAction } from '../../utils/types';
import { SendSchedulingAngle } from './SendAction';
import scheduling from 'node-schedule';

type listenerJob = {
  job: SchedulingAngleModel;
  schedule: scheduling.Job;
};

class ManageScheduleAngle {
  private jobs: SchedulingAngleModel[];

  constructor() {
    this.jobs = [];
  }

  handleDate(date: Date) {
    return dayjs(date).add(3, 'hour').toDate();
  }

  addJob(schedulling: SchedulingAngleModel) {
    this.jobs.push(schedulling);
  }

  removeJob(schedulling_angle_id: string) {
    this.jobs = this.jobs.filter(
      (job) => job.scheduling_angle_id === schedulling_angle_id
    );
  }

  private async getScheduling() {
    const getAllSchedulingAngle = container.resolve(
      GetAllSchedulingAngleUseCase
    );
    try {
      const schedulling = await getAllSchedulingAngle.execute();
      if (schedulling && schedulling.length > 0) {
        for (const job of schedulling) this.addJob(job);
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ManageScheduleAngle.name,
        'GetSchedules Angle'
      );
    }
  }

  private async enqueueJob() {
    if (this.jobs && this.jobs.length > 0) {
      for (const job of this.jobs) {
        console.log('Adicionando novo agendamento ao listener....');
        console.log('...');
        const listenerSchedule = new SendSchedulingAngle(job);

        await listenerSchedule.addListening();
      }
    }
  }

  private async listenerJob(listener: listenerJob) {
    const { job, schedule } = listener;

    emitter.on(`angle-changed-${job.pivot_id}`, (angle) => {
      console.log('Pivot id recebeu alteração de angulo no agendamento');
      if (angle.newAlgle >= job!!.end_angle!) {
        console.log('Angulo está no estágio final...');
        console.log(schedule.name);
      }
    });
    console.log('angulo alterado');
  }

  private async enqueueOneJob(job: SchedulingAngleModel) {
    console.log('Adicionando novo agendamento ao listener....');
    console.log('...');
    const listenerSchedule = new SendSchedulingAngle(job);

    await listenerSchedule.addListening();
  }

  async start() {
    await this.getScheduling();
    await this.enqueueJob();

    emitter.on('scheduling-angle', async (scheduling: SchedulingAngleModel) => {
      const newTimeStamp = this.handleDate(scheduling.timestamp!!);

      const newScheduling: SchedulingAngleModel = {
        ...scheduling,
        timestamp: newTimeStamp
      };

      console.log(`Novo Agendamento Recebido... `);
      this.addJob(newScheduling);
      await this.enqueueOneJob(newScheduling);
    });
  }
}

export const manageScheduleAngle = new ManageScheduleAngle();
