import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import { AuthSignInController } from './AuthLoginController';
import { AuthSignInUseCase } from './AuthLoginUseCase';

const userRepository = new UsersRepository();
const authSigInUseCase = new AuthSignInUseCase(userRepository);
const authSigInController = new AuthSignInController(authSigInUseCase);

export { authSigInController };
