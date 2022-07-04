import { IGetAllBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllSchedulingService } from '@root/useCases/contracts/scheduling';
import { inject, injectable } from 'tsyringe';
import { dateString } from '@utils/convertTimeZoneDate';

@injectable()
class GetAllSchedulingUseCase implements IGetAllSchedulingService {
  constructor(@inject('GetAllBase') private getAll: IGetAllBaseRepo) {}

  async execute(): IGetAllSchedulingService.Response {
    const allSchedulings = await this.getAll.get({ table: 'schedulings' });

    if (allSchedulings === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!allSchedulings) throw new DataNotFound('Scheduling');

    const schedulings = [];

    for (let schedule of allSchedulings) {
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

export { GetAllSchedulingUseCase };
