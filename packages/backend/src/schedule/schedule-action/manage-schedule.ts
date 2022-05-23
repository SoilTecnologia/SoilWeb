import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { container } from 'tsyringe';
import { SchedulingModel } from '../../database/model/Scheduling';
import { DeleteSchedulingUseCase } from '../../useCases/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { GetAllSchedulingUseCase } from '../../useCases/Scheduling/GetAllScheduling/GetAllSchedulingUseCase';
import emitter from '../../utils/eventBus';
import { messageErrorTryAction } from '../../utils/types';
import { ScheduleEmitter } from '../protocols/scheduleEmitterType';
import { SendSchedulingListening } from './SendAction';

class ManageSchedule {
  private jobs: ScheduleEmitter[];

  constructor() {
    this.jobs = [];
  }

  handleDate = (date: Date) => dayjs(date).toDate();
  // return dayjs(date).add(3, 'hour').toDate(); Pc Local

  addJob(schedulling: ScheduleEmitter) {
    this.jobs.push(schedulling);
  }

  removeJob(schedulling: ScheduleEmitter) {
    const { scheduling } = schedulling;
    this.jobs = this.jobs.filter(
      (job) =>
        job.scheduling.scheduling_id === scheduling.scheduling_id &&
        job.scheduling.timestamp === scheduling.timestamp
    );
  }

  async removeScheduleDb(scheduling_id: string) {
    console.log(
      'Data de inicio do agendamento expirado, excluindo agendamento....'
    );
    try {
      const deleteScheduleAngle = container.resolve(DeleteSchedulingUseCase);
      await deleteScheduleAngle.execute(scheduling_id);
      console.log('Agendamento Removido...');
      console.log('...');
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ManageSchedule.name,
        'Delete Schedule Db'
      );
    }
  }

  private async getScheduling() {
    const getAllSchedullingUseCase = container.resolve(GetAllSchedulingUseCase);
    try {
      const schedulling = await getAllSchedullingUseCase.execute();
      if (schedulling && schedulling.length > 0) {
        for (const job of schedulling) {
          const dayNow = dayjs(Date.now());
          dayjs.extend(isSameOrBefore);
          const dateIsBefore = dayjs(job.start_timestamp).isSameOrBefore(
            dayNow
          );
          if (dateIsBefore) this.removeScheduleDb(job.scheduling_id);
          else this.addJob({ scheduling: job, isPut: false });
        }
      }
    } catch (err) {
      messageErrorTryAction(err, false, ManageSchedule.name, 'GetSchedule');
    }
  }

  private async enqueueJob() {
    if (this.jobs && this.jobs.length > 0) {
      for (const job of this.jobs) {
        console.log('Adicionando novo agendamento ao listener....');
        console.log('...');
        const listenerSchedule = new SendSchedulingListening(job);
        await listenerSchedule.addListening();
      }
    }
  }

  private async enqueueOneJob(job: ScheduleEmitter) {
    const listenerSchedule = new SendSchedulingListening(job);

    await listenerSchedule.addListening();
  }

  async start() {
    await this.getScheduling();
    await this.enqueueJob();

    emitter.on('scheduling', async ({ scheduling, isPut }: ScheduleEmitter) => {
      const newStartTimeStamp = this.handleDate(scheduling.start_timestamp!!);
      const newEndTimeStamp = this.handleDate(scheduling.end_timestamp!!);
      const newTimeStamp = this.handleDate(scheduling.timestamp!!);

      const newScheduling: SchedulingModel = {
        ...scheduling,
        start_timestamp: newStartTimeStamp,
        end_timestamp: newEndTimeStamp,
        timestamp: newTimeStamp
      };

      if (isPut) this.removeJob({ scheduling, isPut });

      console.log(`Novo Agendamento Recebido... `);
      this.addJob({ scheduling: newScheduling, isPut });
      await this.enqueueOneJob({ scheduling: newScheduling, isPut });
      // await this.enqueueOneJob({ scheduling: newScheduling, isPut }, false);
    });
  }
}

export const manageSchedule = new ManageSchedule();
