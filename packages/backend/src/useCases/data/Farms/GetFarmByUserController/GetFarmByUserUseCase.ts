import {
  IFindUserByIdRepo,
  IGetFarmByUserIdRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { IGetFarmByUserService } from '@root/useCases/contracts';

@injectable()
class GetFarmByUserUseCase implements IGetFarmByUserService {
  constructor(
    @inject('GetFarmByUser') private findFarms: IGetFarmByUserIdRepo,
    @inject('FindUserById') private findUser: IFindUserByIdRepo
  ) {}

  private async applyQueryGetByUser(user_id: string) {
    try {
      return await this.findFarms.getAll({ user_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetFarmByUserUseCase.name,
        'Get Farm By User Id'
      );
      return DATABASE_ERROR;
    }
  }
  private async applyQueryGetUser(user_id: string) {
    try {
      return await this.findUser.findById({ id: user_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetFarmByUserUseCase.name,
        'Get Farm By User Id'
      );
      return DATABASE_ERROR;
    }
  }

  async execute({
    user_id
  }: IGetFarmByUserService.Params): IGetFarmByUserService.Response {
    /*
      Check types params and values not nullables
    */
    if (user_id === 'undefined' || user_id === 'null') {
      throw new ParamsInvalid();
    }

    const user = await this.applyQueryGetUser(user_id);
    /*
      Check user exist in database
    */
    if (user === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!user) throw new DataNotFound('User');
    else {
      const farms = await this.applyQueryGetByUser(user_id);
      /*
        Check query get farms by user and error database
      */
      if (farms === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!farms) throw new DataNotFound('Farms');
      else return farms;
    }
  }
}

export { GetFarmByUserUseCase };
