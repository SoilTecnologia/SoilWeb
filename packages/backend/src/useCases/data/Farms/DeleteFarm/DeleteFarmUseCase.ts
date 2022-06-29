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

@injectable()
class DeleteFarmUseCase implements IDeleteFarmService {
  constructor(
    @inject('GetByIdBase') private findFarm: IGetByIdBaseRepo<FarmModel>,
    @inject('DeleteBase') private delFarm: IDeleteBaseRepo<FarmModel>
  ) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.get({
        table: 'farms',
        column: 'farm_id',
        id: farm_id
      });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteFarmUseCase.name,
        'Find Farm By Id'
      );
      return DATABASE_ERROR;
    }
  }

  private async applyQueryDeleteFarm(farm_id: string) {
    try {
      return await this.delFarm.del({
        table: 'farms',
        column: 'farm_id',
        data: farm_id
      });
    } catch (err) {
      messageErrorTryAction(err, true, DeleteFarmUseCase.name, 'Delete Farm');
      return DATABASE_ERROR;
    }
  }

  async execute({
    farm_id
  }: IDeleteFarmService.Params): IDeleteFarmService.Response {
    if (farm_id === 'undefined' || farm_id === 'null') {
      throw new ParamsInvalid();
    } else {
      const farmExists = await this.applyQueryFindById(farm_id);

      if (farmExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!farmExists) throw new DataNotFound('Farm');

      const del = await this.applyQueryDeleteFarm(farm_id);

      if (del === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else return { status: del ? 'OK' : 'FAIL' };
    }
  }
}

export { DeleteFarmUseCase };
