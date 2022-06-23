import knex from '@root/database';
import { UserModel } from '@root/database/model/User';
import { IDeleteUserRepo } from '@root/database/protocols';

class DeleteUserRepo implements IDeleteUserRepo {
  async deleteUser({
    user_id
  }: IDeleteUserRepo.Params): IDeleteUserRepo.Response {
    const del = await knex<UserModel>('users')
      .select()
      .where({ user_id })
      .del();
    return del;
  }
}

export { DeleteUserRepo };
