import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError
} from '@root/protocols/errors';
import { IUpdateFarmService } from '@root/useCases/contracts';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@root/database/protocols';
import { checkNumbers, checkStrings } from '@root/utils/decorators/check-types';
import { UserModel } from '@root/database/model/User';

@injectable()
class UpdateFarmUseCase implements IUpdateFarmService {
  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('UpdateBase') private updateFarm: IUpdateBaseRepo
  ) {}

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
    const farmExists = await this.getById.get<FarmModel>({
      table: 'farms',
      id: farm_id,
      column: 'farm_id'
    });

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
        const user = await this.getById.get<UserModel>({
          table: 'users',
          column: 'user_id',
          id: user_id
        });
        if (user === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!user) throw new DataNotFound('User');
        else {
          /*
           Check response and updated farm
          */
          const updated = await this.updateFarm.put<FarmModel>({
            table: 'farms',
            column: 'farm_id',
            where: farm_id,
            data: newFarm
          });

          if (updated === DATABASE_ERROR) throw new DatabaseErrorReturn();
          else if (!updated) throw new NotUpdateError('Farm');
          else return updated;
        }
      }
    }
  }
}

export { UpdateFarmUseCase };
