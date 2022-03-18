import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import { GetAllUserController } from './GetAllUserController';
import { GetAllUserUseCase } from './GetAllUserUseCase';

const userRepository = new UsersRepository();
const getAllUserUseCase = new GetAllUserUseCase(userRepository);
const getAllUserController = new GetAllUserController(getAllUserUseCase);

export { getAllUserController };
