import express from 'express';

export interface IUserAuthInfoRequest extends express.Request {
  user: {
    user_id: string;
    user_type: string;
  }; // or any other type
}

export const authHandler = (
  handler: (
    req: IUserAuthInfoRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => any
) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const requestWrapper: IUserAuthInfoRequest = <IUserAuthInfoRequest>req;
    handler(requestWrapper, res, next);
  };
};
