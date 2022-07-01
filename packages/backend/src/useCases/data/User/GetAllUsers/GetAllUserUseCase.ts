import { IGetAllUserService } from '@root/useCases/contracts';
import { inject, injectable } from 'tsyringe';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllBaseRepo } from '@root/database/protocols/base/getAll';
import { UserModel } from '@root/database/model/User';

@injectable()
class GetAllUserUseCase implements IGetAllUserService {
  constructor(@inject('GetAllBase') private getAll: IGetAllBaseRepo) {}

  async execute() {
    const users = await this.getAll.get<UserModel>({ table: 'users' });

    if (users === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!users || users.length <= 0) throw new DataNotFound('User');
    else return users;
  }
}

export { GetAllUserUseCase };
