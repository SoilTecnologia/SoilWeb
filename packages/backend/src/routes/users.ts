import express from 'express';
import { signInController } from '../controllers/users';
import authMiddleware from '../middlewares/auth';
import { authHandler, IUserAuthInfoRequest } from '../types/express';
import { createUserController } from '../useCases/User/CreateUser';
import { deleteUserController } from '../useCases/User/DeleteUser';
import { getAllUserController } from '../useCases/User/GetAllUsers';
import { updateUserController } from '../useCases/User/Updateuser';

const router = express.Router();

router.post(
  '/signup',
  async (req, res, next) => await createUserController.handle(req, res, next)
);

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

router.get('/allUsers', authMiddleware(), (req, res, next) =>
  getAllUserController.handle(req, res, next)
);

router.put(
  '/putUser',
  authMiddleware(),
  async (req, res, next) => await updateUserController.handle(req, res, next)
);

router.delete(
  '/delUser/:id',
  authMiddleware(),
  async (req, res, next) => await deleteUserController.handle(req, res, next)
);
export default router;

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
