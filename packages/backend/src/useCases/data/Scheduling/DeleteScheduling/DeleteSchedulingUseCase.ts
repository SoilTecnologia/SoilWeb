import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IDeleteSchedulingService } from '@root/useCases/contracts/scheduling';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteSchedulingUseCase implements IDeleteSchedulingService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('DeleteBase') private delRepo: IDeleteBaseRepo
  ) {}

  @checkUndefinedNull(['scheduling_id'])
  async execute({
    scheduling_id
  }: IDeleteSchedulingService.Params): IDeleteSchedulingService.Response {
    const scheduling = await this.getById.get({
      table: 'schedulings',
      column: 'scheduling_id',
      id: scheduling_id
    });

    if (scheduling === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!scheduling) throw new DataNotFound('Scheduling');

    const delSchedule = await this.delRepo.del({
      table: 'schedulings',
      column: 'scheduling_id',
      data: scheduling_id
    });
    if (delSchedule === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else return { status: delSchedule ? 'OK' : 'FAIL' };
  }
}

export { DeleteSchedulingUseCase };
