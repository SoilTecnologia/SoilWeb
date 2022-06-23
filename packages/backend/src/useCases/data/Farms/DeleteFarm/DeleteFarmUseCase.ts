import { IDeleteFarmService } from '@root/useCases/contracts';
import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { IFarmsRepository } from '@database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '@utils/types';
import { IDeleteFarmRepo, IFindFarmByIdRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid
} from '@root/protocols/errors';

@injectable()
class DeleteFarmUseCase implements IDeleteFarmService {
  constructor(
    @inject('FindFarmById') private findFarm: IFindFarmByIdRepo,
    @inject('DeleteFarm') private delFarm: IDeleteFarmRepo
  ) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.find({ farm_id });
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
      return await this.delFarm.delete({ farm_id });
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
