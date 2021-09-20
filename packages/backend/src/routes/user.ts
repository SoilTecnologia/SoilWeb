import express from 'express';
import { loginController, registerController } from '../controllers/user';
import verifyUser from '../middlewares/user';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const {login, password, user_type} = req.body;

  try {
    const cookieInfo = await registerController(login, password, user_type);

    if(!cookieInfo) {
      res.status(403).send("No user created");
      return;
    }

    res.send(cookieInfo);
  } catch(err) {
    next(err);
  }
})

router.post('/signin', async (req, res, next) => {
  const { login, password } = req.body;

  try {
    const cookieInfo = await loginController(login, password);

    if(!cookieInfo) {
      res.status(403).send("Invalid Credentials!");
      return;
    }

    res.send(cookieInfo);
  } catch(err) {
    next(err);
  }
});

export default router;
