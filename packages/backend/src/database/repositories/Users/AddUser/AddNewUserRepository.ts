import knex from '@database/index';
import { UserModel } from '@database/model/User';
import { ICreateUserRepository } from '@database/protocols/users';

class AddNewUserRepo implements ICreateUserRepository {
  async create(
    user: ICreateUserRepository.Params
  ): Promise<ICreateUserRepository.Response> {
    const [newUsers] = await knex<UserModel>('users')
      .insert(user)
      .returning('*');
    return newUsers;
  }
}

export { AddNewUserRepo };
