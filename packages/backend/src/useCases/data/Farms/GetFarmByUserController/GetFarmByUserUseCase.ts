import {
  IGetByIdBaseRepo,
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
import { UserModel } from '@root/database/model/User';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';

@injectable()
class GetFarmByUserUseCase implements IGetFarmByUserService {
  constructor(
    @inject('GetFarmByUser') private findFarms: IGetFarmByUserIdRepo,
    @inject('GetByIdBase') private findUser: IGetByIdBaseRepo<UserModel>
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
      return await this.findUser.get({
        table: 'users',
        column: 'user_id',
        id: user_id
      });
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

  @checkUndefinedNull()
  async execute({
    user_id
  }: IGetFarmByUserService.Params): IGetFarmByUserService.Response {
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
