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

// export const updateUserController = async (
//   user_id: User['user_id'],
//   login?: User['login'],
//   newPassword?: User['password'],
//   user_type?: User['user_type']
// ): Promise<User | null> => {
//   const updatedUser = await db.user.update({
//     data: {
//       login,
//       password: newPassword,
//       user_type
//     },
//     where: {
//       user_id
//     }
//   });

//   return updatedUser;
// };

// export const deleteUserController = async (
//   user_id: User['user_id']
// ): Promise<boolean> => {
//   const deletedUser = await db.user.delete({ where: { user_id } });

//   if (deletedUser) return true;

//   return false;
// };
