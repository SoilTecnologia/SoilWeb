import {
  IGetByIdBaseRepo,
  IGetFarmByUserIdRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { IGetFarmByUserService } from '@root/useCases/contracts';
import { UserModel } from '@root/database/model/User';
import { checkUndefinedNull } from '@root/utils/decorators/check-types';

@injectable()
class GetFarmByUserUseCase implements IGetFarmByUserService {
  constructor(
    @inject('GetFarmByUser') private findFarms: IGetFarmByUserIdRepo,
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo
  ) {}

  @checkUndefinedNull()
  async execute({
    user_id
  }: IGetFarmByUserService.Params): IGetFarmByUserService.Response {
    const user = await this.getById.get<UserModel>({
      table: 'users',
      column: 'user_id',
      id: user_id
    });
    /*
      Check user exist in database
    */
    if (user === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!user) throw new DataNotFound('User');
    else {
      const farms = await this.findFarms.getAll({ user_id });
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
