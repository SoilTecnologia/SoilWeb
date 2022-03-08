import express from 'express';
import authMiddleware from '../middlewares/auth';
import {
  signUpController,
  signInController,
  deleteUserController,
  getAllUsersController,
  putUserController
} from '../controllers/users';
import { IUserAuthInfoRequest, authHandler } from '../types/express';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  const { user_id, login, password, user_type } = req.body;

  try {
    const cookieInfo = await signUpController(
      login,
      password,
      user_type,
      user_id
    );

    res.send(cookieInfo);
  } catch (err) {
    console.log(`[ERROR] Server 500 on /users/signup:`);
    console.log(err);
    next(err);
  }
});

router.post('/signin', async (req, res, next) => {
  const { login, password } = req.body;

  try {
    const cookieInfo = await signInController(login, password);

    res.send(cookieInfo);
  } catch (err) {
    console.log(`[ERROR] Server 500 on /users/signin:`);
    console.log(err);
    next(err);
  }
});

/* Returns the user id. This route is used by the mobile application to check if the token
it has saved is still valid.
  - If it is valid, it returns the user id
  - If it isn't, it will return a 401 on the auth middleware
*/

router.get(
  '/auth',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { user } = req;
      res.json({ user_id: user.user_id });
    }
  )
);

router.get(
  '/allUsers',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const usersList = await getAllUsersController();
        res.send(usersList);
      } catch (err) {
        console.log('[ERROR] Error in the server');
        console.log(err);
        next(err);
      }
    }
  )
);

router.put(
  '/putUser',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { user_id, login, password, user_type } = req.body;

      try {
        const putUser = await putUserController({
          user_id,
          login,
          password,
          user_type
        });

        res.send(putUser);
      } catch (err) {
        console.log('[ERROR] Internal Server error');
        console.log(err);
        next(err);
      }
    }
  )
);

router.delete(
  '/delUser/:id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { id } = req.params;
      try {
        const notUser = await deleteUserController(id);
        res.send(notUser);
      } catch (err) {
        console.log(`[ERROR] 500 on /users/deleteUser`);
        console.log(err);

        next(err);
      }
    }
  )
);

// router.put(
//   '/addFarm',
//   authMiddleware(),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const { user_id } = req.user;
//       const { farm_id, farm_name, farm_city, farm_lng, farm_lat } = req.body;

//       try {
//         const newFarm = await createFarmController(
//           farm_id,
//           user_id,
//           farm_name,
//           farm_city,
//           farm_lng,
//           farm_lat
//         );

//         res.send(newFarm);
//       } catch (err) {
//         console.log(`[ERROR] Server 500 on /users/addFarm!`);
//         console.log(err);
//         next(err);
//       }
//     }
//   )
// );

// router.delete(
//   '/deleteUser',
//   authMiddleware(),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const { user_id } = req.user;
//       try {
//         const notUser = await deleteUserController(user_id);
//         return notUser;
//       } catch (err) {
//         console.log(`[ERROR] 500 on /users/deleteUser`);
//         console.log(err);

//         next(err);
//       }
//     }
//   )
// );

export default router;
