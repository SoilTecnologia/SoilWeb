import knex from '../../..';
import { UserModel } from '../../../model/User';
import { IFindUserByLogin } from '../../../protocols/users';

class FindUserByLoginRepository implements IFindUserByLogin {
  async findUserByLogin(login: IFindUserByLogin.Params): Promise<IFindUserByLogin.Response> {
    try {
      return await knex<UserModel>('users')
        .select('*')
        .where({ login })
        .first();
    } catch (err) {
      console.log('ERROR IN DATABASE QUERIES GET USER BY LOGIN');
      console.log(err);
    }
  }
  
}

export {FindUserByLoginRepository}