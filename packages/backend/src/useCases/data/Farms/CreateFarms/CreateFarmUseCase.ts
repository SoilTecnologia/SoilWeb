import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { messageErrorTryAction } from '@utils/types';
import { ICreateFarmUseCase } from '@root/useCases/contracts';
import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { UserModel } from '@root/database/model/User';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';
import { checkNumbers, checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class CreateFarmUseCase implements ICreateFarmUseCase {
  constructor(
    @inject('CreateBaseRepo') private createFarm: ICreateBaseRepo<FarmModel>,
    @inject('GetByIdBase')
    private getById: IGetByIdBaseRepo<FarmModel | UserModel>
  ) {}

  private async applyQueryGetById(table: 'users' | 'farms', id: string) {
    try {
      const column = table === 'users' ? 'user_id' : 'farm_id';
      return await this.getById.get({
        table,
        column,
        id
      });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateFarmUseCase.name,
        'Find Farm By Id'
      );

      return DATABASE_ERROR;
    }
  }

  private async applyQueryCreateFarm(farm: FarmModel) {
    try {
      return await this.createFarm.create({ table: 'farms', data: farm });
    } catch (err) {
      messageErrorTryAction(err, true, CreateFarmUseCase.name, 'Create Farm');
      return DATABASE_ERROR;
    }
  }

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
    const farmAlreadExisty = await this.applyQueryGetById('farms', farm_id);

    /*
      Check farm exist and response database
    */
    if (farmAlreadExisty === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (farmAlreadExisty) throw new AlreadyExistsError('Farm');
    else {
      const userExists = await this.applyQueryGetById('users', user_id);
      /*
        Check user exist and response databse
      */
      if (userExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!userExists) throw new DataNotFound('User');
      else {
        const newFarm = await this.applyQueryCreateFarm({
          farm_id,
          farm_city,
          farm_lat,
          farm_lng,
          user_id,
          farm_name
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
