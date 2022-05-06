import schedule from 'node-schedule';
import { SchedulingModel } from '../database/model/Scheduling';
import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { DeleteSchedulingUseCase } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { CreateActionUseCase } from '../useCases/Actions/CreateAction/CreateActionUseCase';
import { CreateAction } from '../database/model/types/action';

type callbackProps = (job: any) => void;

type jobActionProps = {
  job: SchedulingModel;
  scheduleObjectJob: schedule.Job;
};
class SendSchedulingListening {
  private job: SchedulingModel;
  private scheduleJob: schedule.Job;

  constructor(newJob: SchedulingModel) {
    this.job = newJob;
  }

  private getOptionsDate(dateReceived: Date) {
    const newDate = dayjs(dateReceived)
      .subtract(1, 'month')
      .add(3, 'hour')
      .toDate();
    return newDate;
  }

  private configJob(date: Date, callback: callbackProps) {
    try {
      this.scheduleJob = schedule.scheduleJob(
        date,
        callback.bind(null, {
          job: this.job,
          scheduleObjectJob: this.scheduleJob
        })
      );
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name}, configJob `);
      console.log(error.message);
      console.log('....');
    }
  }

  private async sendJob({ job }: jobActionProps) {
    const action: Omit<CreateAction, 'timestamp_sent'> = {
      pivot_id: job.pivot_id,
      author: job.author,
      power: job.power || false,
      water: job.water || false,
      direction: job.direction || 'CLOCKWISE',
      percentimeter: job.percentimeter || 0
    };
    try {
      console.log(`Iniciando ação agendada as: ${new Date()}`);
      console.log('.....');
      const createActionUseCase = container.resolve(CreateActionUseCase);
      await createActionUseCase.execute(action, job.timestamp);
    } catch (err) {}
  }

  private async removeJob({ job, scheduleObjectJob }: jobActionProps) {
    try {
      const createActionUseCase = container.resolve(CreateActionUseCase);
      //Excluindo do banco de dados
      const deleteSchedule = container.resolve(DeleteSchedulingUseCase);
      await deleteSchedule.execute(job.scheduling_id);
      // MDesliga o estado
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

      // Separando nome do agendamento
      const nameJobSplit = scheduleObjectJob.name.split(' ');
      const [_, __, numJob, dateCreateJob] = nameJobSplit;
      console.log(
        `Cancelando Agendamento n° ${numJob} criado em ${dateCreateJob}...`
      );
      // Cancelando Agendamento
      schedule.cancelJob(scheduleObjectJob);
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name} of removeJob`);
      console.log(error.message);
      console.log('....');
    }
  }

  async addListening() {
    const { start_timestamp, end_timestamp, is_stop } = this.job;
    // Enviar para iniciar o agendamento
    !is_stop && this.configJob(start_timestamp!!, this.sendJob);
    this.configJob(end_timestamp!!, this.removeJob);
  }
}

export { SendSchedulingListening };
