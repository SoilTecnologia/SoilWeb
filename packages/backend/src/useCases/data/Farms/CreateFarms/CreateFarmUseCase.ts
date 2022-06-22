import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { messageErrorTryAction } from '@utils/types';
import { ICreateFarmUseCase } from '@root/useCases/contracts/farms/create/create-farm-protocol';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';
import { IFindUserByIdRepo } from '@root/database/protocols/users';
import { ICreateFarmRepo } from '@root/database/protocols/farms/create-farms/create-farms-protocol';
import { IFindFarmByIdRepo } from '@root/database/protocols/farms/find-by-farm_id/find';

@injectable()
class CreateFarmUseCase implements ICreateFarmUseCase {
  constructor(
    @inject('CreateFarms') private createFarm: ICreateFarmRepo,
    @inject('FindFarmById') private findFarm: IFindFarmByIdRepo,
    @inject('FindUserById') private findUser: IFindUserByIdRepo
  ) {}

  private async findUserById(user_id: string) {
    try {
      return await this.findUser.findById({ id: user_id });
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

  private async findFarmById(farm_id: string) {
    try {
      return await this.findFarm.find({ farm_id });
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
      return await this.createFarm.create(farm);
    } catch (err) {
      messageErrorTryAction(err, true, CreateFarmUseCase.name, 'Create Farm');
      return DATABASE_ERROR;
    }
  }

  async execute({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    user_id,
    farm_name
  }: ICreateFarmUseCase.Params): Promise<ICreateFarmUseCase.Response> {
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

    if (typeof farm_id !== 'string') throw new TypeParamError('farm_id');
    if (typeof user_id !== 'string') throw new TypeParamError('user_id');
    if (typeof farm_name !== 'string') throw new TypeParamError('farm_name');
    if (typeof farm_city !== 'string') throw new TypeParamError('farm_city');
    if (typeof farm_lat !== 'number') throw new TypeParamError('farm_lat');
    if (typeof farm_lng !== 'number') throw new TypeParamError('farm_lng');

    const farmAlreadExisty = await this.findFarmById(farm_id);

    if (farmAlreadExisty === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (farmAlreadExisty) throw new AlreadyExistsError('Farm');
    else {
      const userExists = await this.findUserById(user_id);

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

        if (newFarm === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!newFarm) throw new FailedCreateDataError('Farm');
        else return newFarm;
      }
    }
  }
}

export { CreateFarmUseCase };
