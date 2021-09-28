import { Prisma, PrismaClient, User, UserType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { DuplicateUniqueError, InvalidCredentials, InvalidRequestBody } from '../types/errors';
import db from '../database';


type Response = {
  user_type: User['user_type'];
  user_id: User['user_id'];
  token: string;
  user: User;
};

export const signInController = async (
  login: User['login'],
  password: User['password']
): Promise<Response | null> => {
  const user = await db.user.findUnique({ where: { login } });
  console.log(user)

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
      user
    };

    return response;
  } else {
    throw new InvalidCredentials();
  }
};

export const signUpController = async (
  login: User['login'],
  password: User['password'],
  user_type: User['user_type']
): Promise<Response | null> => {
  if (login && password) {
    const oldUser = await db.user.findUnique({ where: { login } });

    const newPass = await bcrypt.hash(password, 10);

    if (oldUser) throw new DuplicateUniqueError('login');

    const user = await db.user.create({
      data: {
        login,
        password: newPass,
        user_type
      }
    });

    const { user_id } = user;

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
      user
    };

    return response;
  } else {
    throw new InvalidRequestBody();
  }
};

export const updateUserController = async (
  user_id: User['user_id'],
  login?: User['login'],
  newPassword?: User['password'],
  user_type?: User['user_type']
): Promise<User | null> => {
  const updatedUser = await db.user.update({
    data: {
      login,
      password: newPassword,
      user_type
    },
    where: {
      user_id
    }
  });

  return updatedUser;
};

export const deleteUserController = async (
  user_id: User['user_id']
): Promise<boolean> => {
  const deletedUser = await db.user.delete({ where: { user_id } });

  if (deletedUser) return true;

  return false;
};
