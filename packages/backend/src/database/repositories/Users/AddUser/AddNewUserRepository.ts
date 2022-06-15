import knex from '../../..';
import { UserModel } from '../../../model/User';
import { ICreateUserRepository } from '../../../protocols/users';

class AddNewUserRepository implements ICreateUserRepository {
  async create(user: ICreateUserRepository.Params): Promise<ICreateUserRepository.Response> {
    const newUsers = await knex<UserModel>('users').insert(user).returning('*');
    return newUsers[0]
  }
}

export {AddNewUserRepository}