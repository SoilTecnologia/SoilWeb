import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from '../..';
import User from '../../../models/user';
import { InvalidCredentials } from '../../../types/errors';
import { UserModel } from '../../model/User';
import { IUsersRepository, ResponseDTO } from './IUsersRepository';

class UsersRepository implements IUsersRepository {
  private static INSTANCE: UsersRepository;

  public static getInstance(): UsersRepository {
    if (!UsersRepository.INSTANCE) {
      UsersRepository.INSTANCE = new UsersRepository();
    }

    return UsersRepository.INSTANCE;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return await knex<User>('users').select('*').where({ login }).first();
  }

  async findById(user_id: string): Promise<User | undefined> {
    return await knex<User>('users').select('*').where({ user_id }).first();
  }

  async create(user: UserModel): Promise<User[]> {
    return await knex<User>('users').insert(user).returning('*');
  }

  async signInController(
    login: string,
    password: string
  ): Promise<ResponseDTO | null> {
    const user = await knex<User>('users').select('*').where({ login }).first();

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

  async deleteUserController(user_id: string): Promise<number | undefined> {
    const user = await knex<User>('users').select().where({ user_id }).first();
    if (user) {
      const del = await knex<User>('users').select().where({ user_id }).del();
      return del;
    }
    throw new Error('Failed Delete User');
  }

  async putUserController(user: UserModel): Promise<User | undefined> {
    const putUser = await knex<User>('users')
      .where({ user_id: user.user_id })
      .update(user)
      .returning('*');

    return putUser[0];
  }

  async getAllUsersController(): Promise<User[]> {
    const users = await knex<User>('users').select();
    if (!users) throw new Error('No user found');

    return users;
  }
}

export { UsersRepository };
