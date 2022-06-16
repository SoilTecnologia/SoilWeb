import cors from 'cors';
import express from 'express';
import router from './routes';
import { CreateUserController } from './useCases/User/CreateUser/CreateUserController';

const app = express();
const createUserController = new CreateUserController();

router.post('/test', createUserController.handle);
app.use(cors());
app.use(express.json());
app.use(router);

export { app };
