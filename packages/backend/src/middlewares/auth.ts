import jwt from 'jsonwebtoken';
import express from 'express';
import { isType } from '../utils/types';
import { IUserAuthInfoRequest } from '../types/express';
import { wrap } from 'module';
import { UserType } from '@prisma/client';
import { Request } from 'express';

interface TokenInfo {
  user_id: string;
  user_type: string;
}

// Esse middleware retorna uma
const authMiddleware = (
  target_types: (keyof typeof UserType)[]
): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => any) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('No token provided');

    const decode = <TokenInfo>jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);

    if (!isType(decode.user_type, target_types))
      return res.status(401).send('Failed to authenticate token.');

    let wrappedRequest = <IUserAuthInfoRequest>req;
    wrappedRequest.user = decode;

    req = wrappedRequest;
    next();
  };
};

export default authMiddleware;