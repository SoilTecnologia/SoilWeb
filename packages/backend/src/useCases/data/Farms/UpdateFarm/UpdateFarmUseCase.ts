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
import {
  IFindFarmByIdRepo,
  IFindUserByIdRepo,
  IUpdateFarmRepo
} from '@root/database/protocols';

@injectable()
class UpdateFarmUseCase implements IUpdateFarmService {
  constructor(
    @inject('FindFarmById') private findFarm: IFindFarmByIdRepo,
    @inject('UpdateFarm') private updateFarm: IUpdateFarmRepo,
    @inject('FindUserById') private findUser: IFindUserByIdRepo
  ) {}

  private async applyQueryUserById(user_id: string) {
    try {
      return await this.findUser.findById({ id: user_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateFarmUseCase.name,
        'Find User By Id'
      );
      return DATABASE_ERROR;
    }
  }
  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.find({ farm_id });
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
      return await this.updateFarm.update(farm);
    } catch (err) {
      messageErrorTryAction(err, true, UpdateFarmUseCase.name, 'FUpdate Farm');
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

  async execute({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    farm_name,
    user_id
  }: FarmModel) {
    /*
     Check values null
     */
    if (
      !farm_id ||
      !user_id ||
      !farm_name ||
      !farm_lat ||
      !farm_lng ||
      !farm_city
    ) {
      throw new ParamsInvalid();
    }

    /*
      Check Types of the values
    */
    if (typeof farm_id !== 'string') throw new TypeParamError('farm_id');
    if (typeof user_id !== 'string') throw new TypeParamError('user_id');
    if (typeof farm_name !== 'string') throw new TypeParamError('farm_name');
    if (typeof farm_city !== 'string') throw new TypeParamError('farm_city');
    if (typeof farm_lat !== 'number') throw new TypeParamError('farm_lat');
    if (typeof farm_lng !== 'number') throw new TypeParamError('farm_lng');

    const farmExists = await this.applyQueryFindById(farm_id);

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
        const user = await this.applyQueryUserById(user_id);
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
