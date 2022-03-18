import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import { CreateUserController } from './CreateController';
import { CreateUserUseCase } from './CreateUserUseCase';

const userRepository = new UsersRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
