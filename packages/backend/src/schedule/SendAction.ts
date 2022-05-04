import schedule from 'node-schedule';
import { SchedulingModel } from '../database/model/Scheduling';
import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { DeleteSchedulingUseCase } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';

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

  getOptionsDate(dateReceived: Date) {
    const newDate = dayjs(dateReceived)
      .subtract(1, 'month')
      .add(3, 'hour')
      .toDate();
    return newDate;
  }

  configJobWithDate(date: Date, callback: callbackProps) {
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

  sendJob({ job, scheduleObjectJob }: jobActionProps) {
    console.log('INICIANDO O TRABALHO');
    console.log('...');
  }

  async removeJob({ job, scheduleObjectJob }: jobActionProps) {
    try {
      // Separando nome do agendamento
      const nameJobSplit = scheduleObjectJob.name.split(' ');
      const [_, __, numJob, dateCreateJob] = nameJobSplit;
      console.log(
        `Cancelando Agendamento n° ${numJob} criado em ${dateCreateJob}...`
      );
      // Cancelando Agendamento
      schedule.cancelJob(scheduleObjectJob);
      //Excluindo do banco de dados
      const deleteSchedule = container.resolve(DeleteSchedulingUseCase);
      await deleteSchedule.execute(job.scheduling_id);
      console.log(`Agendamento excluído com sucesso do banco de dados....`);
      console.log('....');
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name} of removeJob`);
      console.log(error.message);
      console.log('....');
    }
  }

  async addListening() {
    const { start_timestamp, end_timestamp } = this.job;
    // Manipula data atual
    const initDate = start_timestamp && this.getOptionsDate(start_timestamp!!);
    const finalDate = end_timestamp && this.getOptionsDate(end_timestamp!!);
    // Enviar para iniciar o agendamento
    initDate && this.configJobWithDate(initDate, this.sendJob);
    finalDate && this.configJobWithDate(finalDate, this.removeJob);
  }
}

export { SendSchedulingListening };
