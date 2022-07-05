import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '@database/model/Scheduling';
import { SchedulingHistoryModel } from '@database/model/SchedulingHistory';
import { dateIsAter, dateSaoPaulo } from '@utils/convertTimeZoneDate';
import emitter from '@utils/eventBus';
import { IUpdateSchedulingService } from '@root/useCases/contracts/scheduling';
import {
  ICreateBaseRepo,
  IGetByIdBaseRepo,
  IUpdateBaseRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError,
  NotUpdateError
} from '@root/protocols/errors';
import {
  checkBooleans,
  checkDate,
  checkNumbers,
  checkStrings
} from '@root/utils/decorators/check-types';

@injectable()
class UpdateSchedulingUseCase implements IUpdateSchedulingService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('UpdateBase') private update: IUpdateBaseRepo,
    @inject('CreateBaseRepo') private create: ICreateBaseRepo
  ) {}

  @checkBooleans(['is_stop', 'power', 'water'])
  @checkNumbers(['percentimeter'])
  @checkDate(['start_timestamp', 'end_timestamp', 'update_timestamp'])
  @checkStrings(['author', 'pivot_id', 'scheduling_id', 'direction'])
  async execute({
    author,
    pivot_id,
    scheduling_id,
    is_stop,
    power,
    water,
    direction,
    percentimeter,
    end_timestamp,
    start_timestamp,
    update_timestamp
  }: IUpdateSchedulingService.Params): IUpdateSchedulingService.Response {
    const getScheduling = await this.getById.get<SchedulingModel>({
      table: 'schedulings',
      column: 'scheduling_id',
      id: scheduling_id
    });

    if (getScheduling === DATABASE_ERROR) throw new DatabaseErrorReturn();
    if (!getScheduling) throw new DataNotFound('Scheduling');

    const dateIsRuning = dateIsAter(
      getScheduling.start_timestamp!,
      update_timestamp
    );

    if (dateIsRuning) {
      console.log('Não é possivel atualizar, agendamento em execução...');
      return { message: 'scheduling is running' };
    } else {
      const newScheduling = await this.update.put<SchedulingModel>({
        table: 'schedulings',
        column: 'scheduling_id',
        where: scheduling_id,
        data: {
          author,
          pivot_id,
          scheduling_id,
          is_stop,
          power,
          water,
          direction,
          percentimeter,
          end_timestamp: dateSaoPaulo(end_timestamp!),
          start_timestamp: dateSaoPaulo(start_timestamp!),
          timestamp: dateSaoPaulo(update_timestamp!)
        }
      });

      if (newScheduling === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!newScheduling) throw new NotUpdateError('Scheduling');

      type omitId = Omit<SchedulingHistoryModel, 'scheduling_history_id'>;
      const schedule: omitId = { ...newScheduling };
      delete schedule.scheduling_id;

      const history = await this.create.create<omitId, SchedulingHistoryModel>({
        table: 'scheduling_historys',
        data: { ...schedule, updated: newScheduling.scheduling_id }
      });

      if (history === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!history) throw new FailedCreateDataError('SchedulingHistory');

      emitter.emit('scheduling', { scheduling: newScheduling, isPut: true });

      return newScheduling;
    }
  }
}

export { UpdateSchedulingUseCase };
