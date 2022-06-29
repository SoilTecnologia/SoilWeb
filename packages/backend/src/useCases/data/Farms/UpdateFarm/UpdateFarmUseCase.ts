import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { messageErrorTryAction } from '@utils/types';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';
import { IUpdateFarmService } from '@root/useCases/contracts';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@root/database/protocols';
import { checkNumbers, checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class UpdateFarmUseCase implements IUpdateFarmService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo<FarmModel>,
    @inject('UpdateBase') private updateFarm: IUpdateBaseRepo<FarmModel>
  ) {}

  private async applyQueryFindById(table: 'users' | 'farms', farm_id: string) {
    try {
      const column = table === 'users' ? 'user_id' : 'farm_id';
      return await this.getById.get({ table, column, id: farm_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateFarmUseCase.name,
        'Find Farm By Id'
      );
      return DATABASE_ERROR;
    }
  }

  private async applyQueryUpdateFarm(farm: FarmModel) {
    try {
      return await this.updateFarm.put({
        table: 'farms',
        column: 'farm_id',
        where: farm.farm_id,
        data: farm
      });
    } catch (err) {
      messageErrorTryAction(err, true, UpdateFarmUseCase.name, 'Update Farm');
      return DATABASE_ERROR;
    }
  }

  private checkObjectIsEquals(oldFarm: FarmModel, newFarm: FarmModel) {
    if (
      oldFarm.farm_id === newFarm.farm_id &&
      oldFarm.user_id === newFarm.user_id &&
      oldFarm.farm_name === newFarm.farm_name &&
      oldFarm.farm_city === newFarm.farm_city &&
      oldFarm.farm_lat === newFarm.farm_lat &&
      oldFarm.farm_lng === newFarm.farm_lng
    ) {
      return true;
    } else false;
  }

  @checkStrings(['farm_id', 'user_id', 'farm_name', 'farm_city'])
  @checkNumbers(['farm_lng', 'farm_lat'])
  async execute({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    farm_name,
    user_id
  }: FarmModel) {
    const farmExists = await this.applyQueryFindById('farms', farm_id);

    /*
     Checks Farm Exists and response Database Find Farm
    */
    if (farmExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!farmExists) throw new DataNotFound('Farm');
    else {
      const newFarm = {
        farm_id,
        farm_city,
        farm_lat,
        farm_lng,
        farm_name,
        user_id
      };

      /*
       Check if new farm is equal a old farm for not necessary updated
      */
      if (this.checkObjectIsEquals(farmExists, newFarm)) {
        throw new Error(
          'New Farm is Strict Equals a Old Farms, Not Updated...'
        );
      } else {
        /*
         Check user exist and reponse error database query find user
        */
        const user = await this.applyQueryFindById('users', user_id);
        if (user === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!user) throw new DataNotFound('User');
        else {
          /*
           Check response and updated farm
          */
          const updated = await this.applyQueryUpdateFarm(newFarm);

          if (updated === DATABASE_ERROR) throw new DatabaseErrorReturn();
          else if (!updated) throw new NotUpdateError('Farm');
          else return updated;
        }
      }
    }
  }
}

export { UpdateFarmUseCase };
