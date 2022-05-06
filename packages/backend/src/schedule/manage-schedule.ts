import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { SchedulingModel } from '../database/model/Scheduling';
import { GetAllSchedulingUseCase } from '../useCases/Scheduling/GetAllScheduling/GetAllSchedulingUseCase';
import emitter from '../utils/eventBus';
import { SendSchedulingListening } from './SendAction';

class ManageSchedule {
  private jobs: SchedulingModel[];

  constructor() {
    this.jobs = [];
  }

  addJob(schedulling: SchedulingModel) {
    this.jobs.push(schedulling);
  }

  removeJob(schedullin_id: string) {
    this.jobs = this.jobs.filter((job) => job.scheduling_id === schedullin_id);
  }

  private async getScheduling() {
    const getAllSchedullingUseCase = container.resolve(GetAllSchedulingUseCase);
    const schedulling = await getAllSchedullingUseCase.execute();
    if (schedulling && schedulling.length > 0) {
      for (const job of schedulling) this.addJob(job);
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

  private async enqueueOneJob(job: SchedulingModel) {
    console.log('Adicionando novo agendamento ao listener....');
    console.log('...');
    const listenerSchedule = new SendSchedulingListening(job);

    await listenerSchedule.addListening();
  }

  async start() {
    await this.getScheduling();
    await this.enqueueJob();

    emitter.on('scheduling', async (scheduling: SchedulingModel) => {
      const newStartTimeStamp = dayjs(scheduling.start_timestamp)
        .add(3, 'hour')
        .toDate();
      const newEndTimeStamp = dayjs(scheduling.end_timestamp)
        .add(3, 'hour')
        .toDate();
      const newTimeStamp = dayjs(scheduling.timestamp).add(3, 'hour').toDate();

      const newScheduling: SchedulingModel = {
        ...scheduling,
        start_timestamp: newStartTimeStamp,
        end_timestamp: newEndTimeStamp,
        timestamp: newTimeStamp
      };
      console.log(`Novo Agendamento Recebido... `);
      this.addJob(newScheduling);
      await this.enqueueOneJob(newScheduling);
    });
  }
}

export const manageSchedule = new ManageSchedule();