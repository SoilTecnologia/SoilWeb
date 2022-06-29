import { IGetAllUserService } from '@root/useCases/contracts';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllBaseRepo } from '@root/database/protocols/base/getAll';
import { UserModel } from '@root/database/model/User';

@injectable()
class GetAllUserUseCase implements IGetAllUserService {
  constructor(
    @inject('GetAllBase') private getUsers: IGetAllBaseRepo<UserModel>
  ) {}

  private async applyQueryGetUsers() {
    try {
      return await this.getUsers.get({ table: 'users' });
    } catch (err) {
      messageErrorTryAction(err, true, GetAllUserUseCase.name, 'Get All Users');
      return DATABASE_ERROR;
    }
  }

  async execute() {
    const users = await this.applyQueryGetUsers();

    if (users === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!users || users.length <= 0) throw new DataNotFound('User');
    else return users;
  }
}

export { GetAllUserUseCase };
