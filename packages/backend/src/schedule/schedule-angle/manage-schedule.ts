import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { container } from 'tsyringe';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { DeleteSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/DeleteSchedulingAngle/DeleteSchedulingAngleUseCase';
import { GetAllSchedulingAngleUseCase } from '../../useCases/SchedulingAngle/GetAllSchedulingAngle/GetAllSchedulingAngleUseCase';
import { dateLocal } from '../../utils/convertTimeZoneDate';
import emitter from '../../utils/eventBus';
import { messageErrorTryAction } from '../../utils/types';
import { ScheduleAngleEmitter } from '../protocols/scheduleEmitterType';
import { SendSchedulingAngle } from './SendAction';

class ManageScheduleAngle {
  private jobs: ScheduleAngleEmitter[];

  constructor() {
    this.jobs = [];
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

  async removeScheduleDb(scheduling_id: string) {
    console.log(
      'Data de inicio do agendamento expirado, excluindo agendamento....'
    );
    try {
      const deleteScheduleAngle = container.resolve(
        DeleteSchedulingAngleUseCase
      );
      await deleteScheduleAngle.execute(scheduling_id);
      console.log('Agendamento Removido...');
      console.log('...');
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ManageScheduleAngle.name,
        'Delete Schedule Db'
      );
    }
  }

  private async getScheduling() {
    const getAllSchedulingAngle = container.resolve(
      GetAllSchedulingAngleUseCase
    );
    try {
      const schedulling = await getAllSchedulingAngle.execute();
      if (schedulling && schedulling.length > 0) {
        for (const job of schedulling) {
          const dayNow = dayjs(Date.now());
          dayjs.extend(isSameOrBefore);
          const dateIsBefore = dayjs(job.start_timestamp).isSameOrBefore(
            dayNow
          );
          if (dateIsBefore) this.removeScheduleDb(job.scheduling_angle_id);
          else this.addJob({ scheduling: job, isPut: false });
        }
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
        const newScheduling: SchedulingAngleModel = {
          ...scheduling,
          start_timestamp: dateLocal(scheduling.timestamp!!),
          timestamp: dateLocal(scheduling.start_timestamp!!)
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
