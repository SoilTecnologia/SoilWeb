import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { authHandler, IUserAuthInfoRequest } from '../protocols/express';
import { AuthSignInController } from '../useCases/data/User/AuthSignInUser/AuthLoginController';
import { CreateUserController } from '../useCases/data/User/CreateUser/CreateUserController';
import { DeleteUserController } from '../useCases/data/User/DeleteUser/deleteUserController';
import { GetAllUserController } from '../useCases/data/User/GetAllUsers/GetAllUserController';
import { UpdateUserController } from '../useCases/data/User/Updateuser/UpdateUserController';

const router = express.Router();

const authSigInController = new AuthSignInController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const getAllUserController = new GetAllUserController();
const updateUserController = new UpdateUserController();

router.post('/signup', createUserController.handle);
router.post('/signin', authSigInController.handle);
router.get('/allUsers', authMiddleware(), getAllUserController.handle);
router.put('/putUser', authMiddleware(), updateUserController.handle);
router.delete('/delUser/:id', authMiddleware(), deleteUserController.handle);

// Rota Mark, a verificar
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

export default router;
