import knex from '../../..';
import { UserModel } from '../../../model/User';
import { IFindUserByLoginRepo } from '../../../protocols/users';

class FindUserByLoginRepo implements IFindUserByLoginRepo {
  async findUserByLogin(
    login: IFindUserByLoginRepo.Params
  ): Promise<IFindUserByLoginRepo.Response> {
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

export { FindUserByLoginRepo };
