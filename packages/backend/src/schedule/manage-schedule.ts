import { ScheduledTask } from 'node-cron';
import { container } from 'tsyringe';
import { SchedulingModel } from '../database/model/Scheduling';
import { GetAllSchedulingUseCase } from '../useCases/Scheduling/GetAllScheduling/GetAllSchedulingUseCase';
import emitter from '../utils/eventBus';
import { listenerSchedule } from './SendAction';

class ManageSchedule {
  private jobs: SchedulingModel[];

  constructor() {
    this.jobs = [];
  }

  private addJob(schedulling: SchedulingModel) {
    this.jobs.push(schedulling);
  }

  private async getScheduling() {
    const getAllSchedullingUseCase = container.resolve(GetAllSchedulingUseCase);
    const schedulling = await getAllSchedullingUseCase.execute();
    if (schedulling && schedulling.length > 0) {
      for (const job of schedulling) this.addJob(job);
    }
  }

  async start() {
    await this.getScheduling();

    emitter.on('scheduling', (scheduleJob: SchedulingModel) => {
      this.addJob(scheduleJob);
    });

    if (this.jobs && this.jobs.length > 0) {
      for (const job of this.jobs) {
        console.log('Add job to listening scheduling');
        console.log('...');
        console.log(job);
        console.log('...');

        await listenerSchedule.addListening(job);
      }
    }
  }
}

export const manageSchedule = new ManageSchedule();
