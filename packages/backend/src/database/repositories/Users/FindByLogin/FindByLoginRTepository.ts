import knex from '../../..';
import { UserModel } from '../../../model/User';
import { IFindUserByLoginRepo } from '../../../protocols/users';

class FindUserByLoginRepo implements IFindUserByLoginRepo {
  async findUserByLogin(
    login: IFindUserByLoginRepo.Params
  ): Promise<IFindUserByLoginRepo.Response> {
    return await knex<UserModel>('users').select('*').where({ login }).first();
  }
}

export { FindUserByLoginRepo };
