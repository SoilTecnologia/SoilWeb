import knex from '@root/database';
import { UserModel } from '@root/database/model/User';

export const deleteUserMocked = async (login: string) => {
  const user = await knex<UserModel>('users')
    .select('*')
    .where({ login })
    .first();

  if (user) await knex('users').select('*').where({ login }).delete();
};
