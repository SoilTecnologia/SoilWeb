import cors from 'cors';
import express from 'express';
import router from './routes';
import { CreateUserController } from './useCases/User/CreateUser/CreateUserController';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const createUserController = new CreateUserController();
app.post('/test', createUserController.handle);
export { app };
