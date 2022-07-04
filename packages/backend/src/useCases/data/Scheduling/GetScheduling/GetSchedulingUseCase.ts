import {
  IGetAllByDataBaseRepo,
  IGetByIdBaseRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '@database/model/Scheduling';
import { dateString } from '@utils/convertTimeZoneDate';
import { IGetSchedulingByPivotService } from '@root/useCases/contracts/scheduling/get-by-pivot';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';

@injectable()
class GetSchedulingUseCase implements IGetSchedulingByPivotService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('GetAllByDataBase') private getAll: IGetAllByDataBaseRepo
  ) {}

  @checkUndefinedNull(['pivot_id'])
  async execute({
    pivot_id
  }: IGetSchedulingByPivotService.Params): IGetSchedulingByPivotService.Response {
    const pivot = await this.getById.get({
      table: 'pivots',
      column: 'pivot_id',
      id: pivot_id
    });

    if (pivot === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!pivot) throw new DataNotFound('Pivot');

    const getScheduling = await this.getAll.get<SchedulingModel>({
      table: 'schedulings',
      column: 'pivot_id',
      where: pivot_id
    });

    if (getScheduling === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!getScheduling) throw new DataNotFound('Schedulings');

    const schedulings = [];
    for (let schedule of getScheduling) {
      Object.assign(schedule, {
        ...schedule,
        start_timestamp: dateString(schedule.start_timestamp!),
        end_timestamp: dateString(schedule.end_timestamp!),
        timestamp: dateString(schedule.timestamp!)
      });

      schedulings.push(schedule);
    }

    return schedulings;
  }
}

export { GetSchedulingUseCase };
