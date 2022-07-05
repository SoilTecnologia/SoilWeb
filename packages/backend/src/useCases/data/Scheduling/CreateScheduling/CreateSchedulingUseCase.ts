import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '@database/model/Scheduling';
import { dateSaoPaulo } from '@utils/convertTimeZoneDate';
import emitter from '@utils/eventBus';
import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@root/protocols/errors';
import { SchedulingHistoryModel } from '@root/database/model/SchedulingHistory';
import {
  checkBooleans,
  checkDate,
  checkNumbers,
  checkStrings
} from '@root/utils/decorators/check-types';
import { PivotModel } from '@root/database/model/Pivot';
import { ICreateSchedulingService } from '@root/useCases/contracts/scheduling';

@injectable()
class CreateSchedulingUseCase implements ICreateSchedulingService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('CreateBaseRepo')
    private createRepo: ICreateBaseRepo
  ) {}

  @checkBooleans(['is_stop', 'power', 'water'])
  @checkStrings(['pivot_id', 'author', 'direction'])
  @checkDate(['start_timestamp', 'end_timestamp', 'timestamp'])
  @checkNumbers(['percentimeter'])
  async execute(
    scheduling: ICreateSchedulingService.Params
  ): ICreateSchedulingService.Response {
    const {
      is_stop,
      pivot_id,
      power,
      water,
      direction,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = scheduling;

    const havePivot = await this.getById.get<PivotModel>({
      table: 'pivots',
      column: 'pivot_id',
      id: pivot_id
    });

    if (havePivot === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!havePivot) throw new DataNotFound('Pivot');

    const schedulingModel = {
      ...scheduling,
      power: is_stop ? false : power,
      water: is_stop ? false : water,
      direction: is_stop ? 'CLOCKWISE' : direction,
      percentimeter: is_stop ? 0 : percentimeter,
      start_timestamp: dateSaoPaulo(start_timestamp!),
      end_timestamp: dateSaoPaulo(end_timestamp!),
      timestamp: dateSaoPaulo(timestamp!)
    };

    const newScheduling = await this.createRepo.create<
      Omit<SchedulingModel, 'scheduling_id'>,
      SchedulingModel
    >({
      table: 'schedulings',
      data: schedulingModel
    });

    if (newScheduling === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!newScheduling) throw new FailedCreateDataError('Scheduling');

    const createHistory = await this.createRepo.create<SchedulingHistoryModel>({
      table: 'scheduling_historys',
      data: {
        ...schedulingModel,
        scheduling_history_id: newScheduling.scheduling_id
      }
    });

    if (createHistory === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!createHistory) throw new FailedCreateDataError('Scheduling');
    else {
      emitter.emit('scheduling', { scheduling: newScheduling, isPut: false });

      return newScheduling;
    }
  }
}

export { CreateSchedulingUseCase };
