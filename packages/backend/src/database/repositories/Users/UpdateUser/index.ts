import knex from '@root/database';
import { UserModel } from '@root/database/model/User';
import { IUpdateUserRepo } from '@root/database/protocols';
import { IUpdateUserService } from '@root/useCases/contracts';

class UpdateUserRepo implements IUpdateUserRepo {
  async update({
    login,
    password,
    user_type,
    user_id
  }: UserModel): IUpdateUserService.Response {
    const [putUser] = await knex<UserModel>('users')
      .where({ user_id })
      .update({ login, password, user_type, user_id })
      .returning('*');

    return putUser;
  }
}

export { UpdateUserRepo };
