import express from 'express';
import { signInController, signUpController } from '../controllers/user';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { login, password, user_type } = req.body;

  try {
    const cookieInfo = await signUpController(login, password, user_type);

    res.send(cookieInfo);
  } catch (err) {
    if (err instanceof Error) {
      if (err.name == 'DuplicateUniqueError') return res.status(400).send(err.message);
    }

    next(err);
  }
});

router.post('/signin', async (req, res, next) => {
  const { login, password } = req.body;

  try {
    const cookieInfo = await signInController(login, password);

    if (!cookieInfo) {
      res.status(403).send('Invalid Credentials!');
      return;
    }

    res.send(cookieInfo);
  } catch (err) {
    next(err);
  }
});

export default router;
