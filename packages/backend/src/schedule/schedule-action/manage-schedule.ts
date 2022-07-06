import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { SchedulingModel } from '../../database/model/Scheduling';
import { DeleteSchedulingUseCase } from '../../useCases/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { GetAllSchedulingUseCase } from '../../useCases/Scheduling/GetAllScheduling/GetAllSchedulingUseCase';
import emitter from '../../utils/eventBus';
import { messageErrorTryAction } from '../../utils/types';
import { ScheduleEmitter } from '../protocols/scheduleEmitterType';
import { scheduleFactory } from '../protocols/scheduleFactory';
import { checkDateGranted } from '../utils/dateUtils';
import { SendSchedulingListening } from './SendAction';

class ManageSchedule {
  private jobs: ScheduleEmitter[];

  constructor() {
    this.jobs = [];
  }

  private addJob(schedulling: ScheduleEmitter) {
    this.jobs.push(schedulling);
  }

  private removeJob(schedulling: ScheduleEmitter) {
    const { scheduling } = schedulling;
    this.jobs = this.jobs.filter(
      (job) =>
        job.scheduling.scheduling_id !== scheduling.scheduling_id &&
        job.scheduling.timestamp !== scheduling.timestamp
    );

    scheduleFactory.cancelJob(`${scheduling.scheduling_id}-start`);
    scheduleFactory.cancelJob(`${scheduling.scheduling_id}-stop`);
  }

  private async removeScheduleDb(scheduling_id: string) {
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
        console.log(`Existem agendamentos por data pendentes, iniciando verificação... \nChecando se a data atual é maior que data dos agendamentos
          `);

        for (const job of schedulling) {
          const dateIsBefore = checkDateGranted(
            job.end_timestamp!!,
            job.scheduling_id
          );
          const startIsBefore = checkDateGranted(
            job.start_timestamp!,
            job.scheduling_id
          );
          // Se a data atual for maior que a data de fim do agendamento,
          //pode excluir o agendamento do banco de dados
          // Se não verifica se a data atual for maior que a data de inicio,
          // significa que o agendamento já era pra ter iniciado, porém ele
          // ainda estaria em andamento, com isso vai iniciar o job...
          if (dateIsBefore) this.removeScheduleDb(job.scheduling_id);
          else {
            const newJob: SchedulingModel = {
              ...job,
              start_timestamp: startIsBefore
                ? dayjs(Date.now() + 20000)
                    .tz('America/Sao_Paulo')
                    .toDate()
                : job.start_timestamp
            };
            console.log(
              'Adicionando novo agendamento por data ao listener....'
            );
            const listenerSchedule = new SendSchedulingListening();
            await listenerSchedule.addListening({
              scheduling: newJob,
              isPut: false
            });
          }
        }
        console.log('');
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
        const listenerSchedule = new SendSchedulingListening();
        await listenerSchedule.addListening(job);
      }
    }
  }

  private async enqueueOneJob(job: ScheduleEmitter) {
    console.log('Adicionando novo agendamento por data ao listener....');
    const listenerSchedule = new SendSchedulingListening();
    await listenerSchedule.addListening(job);
  }

  async start() {
    await this.getScheduling();
    await this.enqueueJob();

    emitter.on('scheduling', async ({ scheduling, isPut }: ScheduleEmitter) => {
      if (isPut) this.removeJob({ scheduling, isPut });

      console.log(`Novo Agendamento Recebido... `);
      this.addJob({ scheduling, isPut });
      await this.enqueueOneJob({ scheduling, isPut });
    });
  }
}

export const manageSchedule = new ManageSchedule();
