import { messageErrorTryAction } from '@root/utils/types';
import express from 'express';
import jwt from 'jsonwebtoken';
import { IUserAuthInfoRequest } from '../express';

interface TokenInfo {
  user_id: string;
  user_type: string;
}

/*
  This middleware processes the token received on the request header Authorization.

  - Returns 200 and user details if it's valid
  - Returns 40x if the token is invalid or not provided
*/

type MiddleResponse = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => any;

const authMiddleware = (): MiddleResponse => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const secretKey =
      process.env.NODE_ENV === 'test' ? 'testsoil' : process.env.TOKEN_SECRET;

    const token = req.headers.authorization;
    if (!token) return res.status(401).send('No token provided');

    try {
      const decode = <TokenInfo>jwt.verify(token, secretKey as jwt.Secret);

      const wrappedRequest = <IUserAuthInfoRequest>req;
      wrappedRequest.user = decode;

      req = wrappedRequest;
      next();
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        'AuthMiddleware',
        'Error in check token'
      );
      res.status(401).send('Invalid Token!');
    }
  };
};

export default authMiddleware;
