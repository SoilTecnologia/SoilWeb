import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import { DeleteUserController } from './deleteUserController';
import { DeleteUserUseCase } from './deleteUserUseCase';

const userRepository = new UsersRepository();
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserController };
