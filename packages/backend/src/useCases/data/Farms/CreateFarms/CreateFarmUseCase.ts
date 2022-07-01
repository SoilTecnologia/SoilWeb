import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { ICreateFarmUseCase } from '@root/useCases/contracts';
import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { UserModel } from '@root/database/model/User';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@root/protocols/errors';
import { checkNumbers, checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class CreateFarmUseCase implements ICreateFarmUseCase {
  constructor(
    @inject('CreateBaseRepo') private createFarm: ICreateBaseRepo,
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo
  ) {}

  @checkStrings(['farm_id', 'user_id', 'farm_name', 'farm_city'])
  @checkNumbers(['farm_lng', 'farm_lat'])
  async execute({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    user_id,
    farm_name
  }: ICreateFarmUseCase.Params): Promise<ICreateFarmUseCase.Response> {
    const farmAlreadExisty = await this.getById.get<FarmModel>({
      table: 'farms',
      column: 'farm_id',
      id: farm_id
    });

    /*
      Check farm exist and response database
    */
    if (farmAlreadExisty === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (farmAlreadExisty) throw new AlreadyExistsError('Farm');
    else {
      const userExists = await this.getById.get<UserModel>({
        table: 'users',
        column: 'user_id',
        id: user_id
      });
      /*
        Check user exist and response databse
      */
      if (userExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!userExists) throw new DataNotFound('User');
      else {
        const newFarm = await this.createFarm.create({
          table: 'farms',
          data: {
            farm_id,
            farm_city,
            farm_lat,
            farm_lng,
            user_id,
            farm_name
          }
        });
        /*
          Check is user created with sucessfully
          */
        if (newFarm === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!newFarm) throw new FailedCreateDataError('Farm');
        else return newFarm;
      }
    }
  }
}

export { CreateFarmUseCase };
