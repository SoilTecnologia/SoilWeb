import knex from '@database/index';
import { UserModel } from '@database/model/User';
import { IFindUserByLoginRepo } from '@database/protocols/users';

class FindUserByLoginRepo implements IFindUserByLoginRepo {
  async findUserByLogin(
    login: IFindUserByLoginRepo.Params
  ): Promise<IFindUserByLoginRepo.Response> {
    return await knex<UserModel>('users').select('*').where({ login }).first();
  }
}

export { FindUserByLoginRepo };
