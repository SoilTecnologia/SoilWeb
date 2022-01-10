import jwt from 'jsonwebtoken';
import express from 'express';
import { isType } from '../utils/types';
import { IUserAuthInfoRequest } from '../types/express';
import User from '../models/user';

interface TokenInfo {
  user_id: string;
  user_type: string;
}

/*
  This middleware processes the token received on the request header Authorization.
  
  - Returns 200 and user details if it's valid
  - Returns 40x if the token is invalid or not provided
*/
const authMiddleware = (): ((
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

    try {
      const decode = <TokenInfo>(
        jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret)
      );

      let wrappedRequest = <IUserAuthInfoRequest>req;
      wrappedRequest.user = decode;

      req = wrappedRequest;
      next();
    } catch (err) {
      res.status(401).send("Invalid Token!")
    }
  };
};

export default authMiddleware;
