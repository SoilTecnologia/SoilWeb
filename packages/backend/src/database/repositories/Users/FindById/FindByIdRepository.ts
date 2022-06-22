import { IFindUserByIdRepo } from '@root/database/protocols/users/find-by-id/IFindByIdRepository';
import knex from '@database/index';
import { UserModel } from '@database/model/User';

class FindUserByIdRepo implements IFindUserByIdRepo {
  async findById({ id }: IFindUserByIdRepo.Params): IFindUserByIdRepo.Response {
    return await knex<UserModel>('users')
      .select('*')
      .where({ user_id: id })
      .first();
  }
}

export { FindUserByIdRepo };
