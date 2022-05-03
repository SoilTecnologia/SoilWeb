import cron from 'node-cron';
import { SchedulingModel } from '../database/model/Scheduling';

type optionsSchedule = {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
};

type callbackProps = () => void;

class SendSchedulingListening {
  private job: SchedulingModel;

  getDateSchedulling(date: Date) {
    const dateString = date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'full'
    });

    const dateSplit = dateString.split(' ');
    const dateFull = dateSplit[0].split('/');
    const timeFull = dateSplit[1].split(':');

    const [day, month, year] = dateFull;
    const [hour, minute, second] = timeFull;

    return { day, month, year, hour, minute, second };
  }

  configJob(options: optionsSchedule, callback: callbackProps) {
    const second = options.second || '*';
    const minute = options.minute || '*';
    const hour = options.hour || '*';
    const day = options.day || '*';
    const month = options.month || '*';

    const cronArg = `${second} ${minute} ${hour} ${day} ${month} *`;

    try {
      const jobRuning = cron.schedule(cronArg, callback, {
        scheduled: false,
        timezone: 'America/Sao_Paulo'
      });

      jobRuning.start();
    } catch (err) {
      const error = err as Error;
      console.log(`Error in ${SendSchedulingListening.name}, configJob `);
      console.log(err.message);
      console.log('....');
    }
  }

  sendJob() {}

  removeJob() {}

  async addListening(newJob: SchedulingModel) {
    const initDate =
      newJob.start_timestamp && this.getDateSchedulling(newJob.start_timestamp);
    const endDate =
      newJob.end_timestamp && this.getDateSchedulling(newJob.end_timestamp);

    initDate && this.configJob(initDate, this.sendJob);
    endDate && this.configJob(endDate, this.removeJob);
  }
}

const listenerSchedule = new SendSchedulingListening();
export { listenerSchedule };
