import { IGetAllUserService } from '@root/useCases/contracts/users/get-all-user/get-all-user';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllUserRepo } from '@root/database/protocols/users/get-all/IGetAllUserRepo';

@injectable()
class GetAllUserUseCase implements IGetAllUserService {
  constructor(@inject('GetAllUsers') private getUsers: IGetAllUserRepo) {}

  private async applyQueryGetUsers() {
    try {
      return await this.getUsers.getAll();
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
