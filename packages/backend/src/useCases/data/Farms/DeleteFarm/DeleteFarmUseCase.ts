import { IDeleteFarmService } from '@root/useCases/contracts';
import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { messageErrorTryAction } from '@utils/types';
import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid
} from '@root/protocols/errors';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';

@injectable()
class DeleteFarmUseCase implements IDeleteFarmService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('DeleteBase') private delFarm: IDeleteBaseRepo
  ) {}

  @checkUndefinedNull(['farm_id'])
  async execute({
    farm_id
  }: IDeleteFarmService.Params): IDeleteFarmService.Response {
    const farmExists = await this.getById.get({
      table: 'farms',
      column: 'farm_id',
      id: farm_id
    });

    if (farmExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farmExists) throw new DataNotFound('Farm');

    const del = await this.delFarm.del({
      table: 'farms',
      column: 'farm_id',
      data: farm_id
    });

    if (del === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else return { status: del ? 'OK' : 'FAIL' };
  }
}

export { DeleteFarmUseCase };
