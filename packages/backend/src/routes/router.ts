import express from 'express';
import userRoute from './user';
import farmRoute from './farm';
import pivotRoute from './pivot';
import { DuplicateUniqueError, InvalidCredentials } from '../types/errors';

const router = express.Router();

/*
  This functions is a error middleware
  This means that whenever a error is thrown inside a route, express catches the error and calls this function.

  When this function is called we end the request-response cycle sending a error message with Status 500.

  see: https://github.com/expressjs/express/blob/master/examples/error/index.js
*/

function error(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if(err instanceof DuplicateUniqueError)
    res.status(400).send(err.message);
  else if(err instanceof InvalidCredentials)
    res.status(400).send(err.message);
  else
    res.status(500).send('Internal Server Error')
  next();
}

router.use('/user', userRoute);
router.use('/farm', farmRoute);
router.use('/pivot', pivotRoute);
router.use(error);

export default router;
