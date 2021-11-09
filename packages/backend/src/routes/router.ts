import express from 'express';
import userRoute from './user';
import farmRoute from './farm';
import pivotRoute from './pivot';
import radioRoute from './radio';
import nodeRoute from './node';
import cycleRoute from './cycle';
import intentRoute from './intent';
// import raspberryRoute from './raspberry';
import testRoute from './test';

import {
  DuplicateUniqueError,
  InvalidCredentials,
  ServerError
} from '../types/errors';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prismaClient = new PrismaClient();

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
  console.log(err)
  if (err instanceof ServerError) res.status(400).send(err.message);
  else if (err instanceof Error) res.status(500).send(err.message);
  else res.status(500).send('Internal Server Error');
  next();
}

router.use('/user', userRoute);
router.use('/farm', farmRoute);
router.use('/pivot', pivotRoute);
router.use('/node', nodeRoute);
router.use('/cycle', cycleRoute);
router.use('/radio', radioRoute);
router.use('/intent', intentRoute);
// router.use('/raspberry', raspberryRoute);
router.use('/test', testRoute);
router.use(error);

export default router;
