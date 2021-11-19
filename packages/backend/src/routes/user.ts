import express from 'express';
import {
  signInController,
  signUpController,
  deleteUserController
} from '../controllers/user';
import { DuplicateUniqueError } from '../types/errors';
import db from '../database';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { login, password, user_type } = req.body;

  try {
    const cookieInfo = await signUpController(login, password, user_type);

    res.send(cookieInfo);
  } catch (err) {
    next(err);
  }
});

router.post('/signin', async (req, res, next) => {
  const { login, password } = req.body;

  try {
    const cookieInfo = await signInController(login, password);

    res.send(cookieInfo);
  } catch (err) {
    next(err);
  }
});

// Retorna 200 se o usuaŕio existir no banco 
// e 401 se não existir

router.get('/auth/:user_id', async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user = await db.user.findFirst({ where: { user_id } });

    if (user) {
      res.send({ msg: 'OK' });
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:user_id', async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const response = await deleteUserController(user_id);

    res.send(response);
  } catch (err) {
    next(err);
  }
});

export default router;
