import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { CreateActionUseCase } from '../../useCases/Actions/CreateAction/CreateActionUseCase';
import { GetAllSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/GetAllSchedulingAngle/GetAllSchedulingAngleUseCase';
import { GetStateVariableUseCase } from '../../useCases/StateVariable/GetStateVariable/GetStateVariableUseCase';
import emitter from '../../utils/eventBus';
import { messageErrorTryAction } from '../../utils/types';
import { ScheduleAngleEmitter } from '../protocols/scheduleEmitterType';
import { SendSchedulingAngle } from './SendAction';

class ManageScheduleAngle {
  private jobs: ScheduleAngleEmitter[];

  constructor() {
    this.jobs = [];
  }

  handleDate(date: Date) {
    return dayjs(date).add(3, 'hour').toDate();
  }

  addJob({ scheduling, isPut }: ScheduleAngleEmitter) {
    this.jobs.push({ scheduling, isPut });
  }

  removeJob(schedulling_angle: SchedulingAngleModel) {
    this.jobs = this.jobs.filter(
      (job) =>
        job.scheduling.scheduling_angle_id ===
        schedulling_angle.scheduling_angle_id
    );
  }

  private async getScheduling() {
    const getAllSchedulingAngle = container.resolve(
      GetAllSchedulingAngleUseCase
    );
    try {
      const schedulling = await getAllSchedulingAngle.execute();
      if (schedulling && schedulling.length > 0) {
        for (const job of schedulling)
          this.addJob({ scheduling: job, isPut: false });
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

  private async enqueueOneJob({ scheduling, isPut }: ScheduleAngleEmitter) {
    console.log('Adicionando novo agendamento ao listener....');
    console.log('...');
    const listenerSchedule = new SendSchedulingAngle({ scheduling, isPut });

    await listenerSchedule.addListening();
  }

  async start() {
    await this.getScheduling();
    await this.enqueueJob();

    emitter.on(
      'scheduling-angle',
      async ({ scheduling, isPut }: ScheduleAngleEmitter) => {
        const newTimeStamp = this.handleDate(scheduling.timestamp!!);
        const newStartTimeStamp = this.handleDate(scheduling.timestamp!!);

        const newScheduling: SchedulingAngleModel = {
          ...scheduling,
          start_timestamp: newStartTimeStamp,
          timestamp: newTimeStamp
        };
        if (isPut) this.removeJob(scheduling);

        console.log(`Novo Agendamento Recebido... `);
        this.addJob({ scheduling: newScheduling, isPut });
        await this.enqueueOneJob({ scheduling: newScheduling, isPut });
      }
    );
  }
}

export const manageScheduleAngle = new ManageScheduleAngle();
