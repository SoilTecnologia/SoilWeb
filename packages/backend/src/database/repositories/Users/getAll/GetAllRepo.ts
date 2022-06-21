import knex from '@root/database';
import { UserModel } from '@root/database/model/User';
import { IGetAllUserRepo } from '@root/database/protocols/users/get-all/IGetAllUserRepo';

class GetAllUserRepo implements IGetAllUserRepo {
  async getAll(): IGetAllUserRepo.Response {
    const users = await knex<UserModel>('users').select();
    return users;
  }
}

export { GetAllUserRepo };
