import express from 'express';
import authMiddleware from '../middlewares/auth';
import { signUpController, signInController } from '../controllers/users';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { createFarmController } from '../controllers/farms';

const router = express.Router();

  router.post('/signup', async (req, res, next) => {
    const { login, password, user_type } = req.body;

    try {

      const cookieInfo = await signUpController(login, password, user_type);

      res.send(cookieInfo);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  });

  router.post('/signin', async (req, res, next) => {
    const { login, password } = req.body;

    try {
      const cookieInfo = await signInController(login, password);

      res.send(cookieInfo);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  });

router.put(
  '/addFarm',
  authMiddleware(['SUDO', 'USER']),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const user = req.user;
      const { farm_id, farm_name, farm_city, farm_lng, farm_lat } = req.body;

      try {
        const newFarm = await createFarmController(
          farm_id,
          user.user_id,
          farm_name,
          farm_city,
          farm_lng,
          farm_lat
        );

        res.send(newFarm);
      } catch (err) {
        console.log(`Server 500: ${err}`);
        next(err);
      }
    }
  )
);

  export default router;