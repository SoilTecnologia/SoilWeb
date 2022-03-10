import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import knex from '../database';
import {
  DuplicateUniqueError,
  InvalidCredentials,
  InvalidRequestBody
} from '../types/errors';

import User from '../models/user';
import { deleteUser } from '../utils/deleteCascade';

type Response = {
  user_type: User['user_type'];
  user_id: User['user_id'];
  token: string;
};

/*
  Checks user credentials and if OK returns tokens and user details
*/

export const signInController = async (
  login: User['login'],
  password: User['password']
): Promise<Response | null> => {
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
};

export const signUpController = async (
  login: User['login'],
  password: User['password'],
  user_type: User['user_type'],
  user_id?: User['user_id']
): Promise<Response | null> => {
  if (login && password) {
    const oldUser = await knex<User>('users')
      .select('*')
      .where({ login })
      .first();

    const encryptedPassword = await bcrypt.hash(password, 10);

    if (oldUser) throw new DuplicateUniqueError('login');

    const newUser = await knex<User>('users').insert({
      login,
      password: encryptedPassword,
      user_type,
      user_id
    });

    const user = await knex<User>('users').select('*').where({ login }).first();

    if (user) {
      const token = jwt.sign(
        {
          user_id: user.user_id,
          user_type: user.user_type
        },
        process.env.TOKEN_SECRET as jwt.Secret,
        {
          expiresIn: '2h'
        }
      );

      const response = {
        user_id: user.user_id,
        user_type: user.user_type,
        token
      };
      return response;
    }
    throw new Error('Failed to create user');
  } else {
    throw new InvalidRequestBody();
  }
};

export const deleteUserController = async (user_id: User['user_id']) => {
  try {
    const user = await knex<User>('users').select().where({ user_id }).first();
    if (user) {
      const del = await knex<User>('users').select().where({ user_id }).del();
      return del;
    }
  } catch (err) {
    console.log('[ERROR] INTERNAL SERVER ERROR');
    console.log(err);
  }
};

export const putUserController = async (user: User) => {
  const selectUser = await knex<User>('users')
    .select()
    .where({ user_id: user.user_id })
    .first();

  if (selectUser) {
    await knex<User>('users')
      .where({ user_id: user.user_id })
      .update({
        user_id: user.user_id ? user.user_id : selectUser.user_id,
        login: user.login ? user.login : selectUser.login,
        password: user.password ? user.password : selectUser.password,
        user_type: user.user_type ? user.user_type : selectUser.user_type
      });

    const newUser = await knex<User>('users')
      .select()
      .where({ user_id: user.user_id })
      .first();

    return newUser;
  }
  throw new Error('[ERROR] User not find');
};

export const getAllUsersController = async () => {
  try {
    const users = await knex<User>('users').select();
    if (!users) throw new Error('No user found');

    return users;
  } catch (err) {
    throw new InvalidCredentials();
  }
};
