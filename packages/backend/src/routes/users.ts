import express from 'express';
import authMiddleware from '../middlewares/auth';
import { authHandler, IUserAuthInfoRequest } from '../types/express';
import { AuthSignInController } from '../useCases/User/AuthSignInUser/AuthLoginController';
import { CreateUserController } from '../useCases/User/CreateUser/controllers/CreateUserController';
import { DeleteUserController } from '../useCases/User/DeleteUser/deleteUserController';
import { GetAllUserController } from '../useCases/User/GetAllUsers/GetAllUserController';
import { UpdateUserController } from '../useCases/User/Updateuser/UpdateUserController';

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
