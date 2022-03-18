import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import User from '../../../models/user';
import { InvalidCredentials } from '../../../types/errors';

class AuthSignInUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(login: User['login'], password: User['password']) {
    const user = await this.userRepository.findByLogin(login);
    const comparePassword = await bcrypt.compare(password, user!!.password);

    if (user && comparePassword) {
      const { user_id, user_type } = user;

      const token = jwt.sign(
        {
          user_id,
          user_type
        },
        process.env.TOKEN_SECRET as jwt.Secret,
        {
          expiresIn: '2h'
        }
      );

      const response = {
        user_id,
        user_type,
        token
      };

      return response;
    }
    throw new InvalidCredentials();
  }
}

export { AuthSignInUseCase };
