import { inject, injectable } from 'tsyringe';
import { IFarmsRepository } from '@database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '@utils/types';
import { IFindFarmByIdRepo } from '@root/database/protocols/farms/find-by-farm_id/find';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';

@injectable()
class GetOneFarmUseCase {
  constructor(@inject('FindFarmById') private findFarm: IFindFarmByIdRepo) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.find({ farm_id });
    } catch (err) {
      messageErrorTryAction(err, true, GetOneFarmUseCase.name, 'Get One Farm');
      return DATABASE_ERROR;
    }
  }

  async execute(farm_id: string) {
    if (farm_id === 'undefined' || farm_id === 'null') {
      throw new ParamsInvalid();
    } else {
      const farm = await this.applyQueryFindById(farm_id);
      if (farm === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else return farm;
    }
  }
}

export { GetOneFarmUseCase };
