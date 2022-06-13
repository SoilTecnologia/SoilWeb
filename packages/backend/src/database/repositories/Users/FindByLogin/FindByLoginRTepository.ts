import knex from '../../..';
import { UserModel } from '../../../model/User';
import { IFindByLogin } from './IFindByLoginRepository';

class FindUserByLoginRepository implements IFindByLogin {
  async findByLogin(login: string): Promise<UserModel | undefined> {
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