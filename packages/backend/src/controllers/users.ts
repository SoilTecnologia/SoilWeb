import knex from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  DuplicateUniqueError,
  InvalidCredentials,
  InvalidRequestBody
} from '../types/errors';

import User from '../models/users';

type Response = {
  user_type: User['user_type'];
  user_id: User['user_id'];
  token: string;
};

export const signInController = async (
  login: User['login'],
  password: User['password']
): Promise<Response | null> => {
  const user = await knex<User>('users').select('*').where({ login }).first();

  if (user && (await bcrypt.compare(password, user.password))) {
    const { user_id, user_type } = user;

    const token = jwt.sign(
      {
        user_id: user_id,
        user_type: user_type
      },
      process.env.TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: '2h'
      }
    );

    const response = {
      user_id,
      user_type,
      token,
    };

    return response;
  } else {
    throw new InvalidCredentials();
  }
};

export const signUpController = async (
  login: User['login'],
  password: User['password'],
  user_type?: User['user_type']
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
      user_type
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
    } else {
      throw new Error('Failed to create user');
    }
  } else {
    throw new InvalidRequestBody();
  }
};