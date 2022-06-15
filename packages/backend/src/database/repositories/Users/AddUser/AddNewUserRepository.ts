import knex from '@database/index';
import { UserModel } from '../../../model/User';
import { ICreateUserRepository } from '../../../protocols/users';

class AddNewUserRepo implements ICreateUserRepository {
  async create(
    user: ICreateUserRepository.Params
  ): Promise<ICreateUserRepository.Response> {
    const newUsers = await knex<UserModel>('users').insert(user).returning('*');
    return newUsers[0];
  }
}

export { AddNewUserRepo };
