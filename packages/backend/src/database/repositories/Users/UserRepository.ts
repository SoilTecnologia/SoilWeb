import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from '../..';
import { InvalidCredentials } from '../../../types/errors';
import { UserModel } from '../../model/User';
import { IUsersRepository, ResponseDTO } from './IUsersRepository';

class UsersRepository implements IUsersRepository {
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

  async findById(user_id: string): Promise<UserModel | undefined> {
    return await knex<UserModel>('users')
      .select('*')
      .where({ user_id })
      .first();
  }

  async create(user: UserModel): Promise<UserModel[]> {
    return await knex<UserModel>('users').insert(user).returning('*');
  }

  async signInController(
    login: string,
    password: string
  ): Promise<ResponseDTO | null> {
    const user = await knex<UserModel>('users')
      .select('*')
      .where({ login })
      .first();

    if (user && (await bcrypt.compare(password, user.password))) {
      const { user_id, user_type } = user;

      const token = jwt.sign(
        {
          user_id,
          user_type
        },
        process.env.TOKEN_SECRET as jwt.Secret,
        {
          expiresIn: '2h'
        }
      );

      const response = {
        user_id,
        user_type,
        token
      };

      return response;
    }

    throw new InvalidCredentials();
  }

  async deleteUser(user_id: string): Promise<number | undefined> {
    const user = await this.findById(user_id);
    if (user) {
      const del = await knex<UserModel>('users')
        .select()
        .where({ user_id })
        .del();
      return del;
    }
    throw new Error('Failed Delete User');
  }

  async putUser(user: UserModel): Promise<UserModel | undefined> {
    const putUser = await knex<UserModel>('users')
      .where({ user_id: user.user_id })
      .update(user)
      .returning('*');

    return putUser[0];
  }

  async getAllUsers(): Promise<UserModel[]> {
    const users = await knex<UserModel>('users').select();
    if (!users) throw new Error('No user found');

    return users;
  }
}

export { UsersRepository };
