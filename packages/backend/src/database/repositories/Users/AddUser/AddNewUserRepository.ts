import knex from '../../..';
import { AddUserModel } from '../../../../useCases/User/CreateUser/protocols/ICreateUser';
import { UserModel } from '../../../model/User';
import { IAddNewUser } from './IAddNewUser';

class AddNewUserRepository implements IAddNewUser {
  async create(user: AddUserModel): Promise<UserModel> {
    const newUsers = await knex<UserModel>('users').insert(user).returning('*');
    return newUsers[0]
  }
}

export {AddNewUserRepository}