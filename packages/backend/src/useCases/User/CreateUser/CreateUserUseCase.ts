import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../database/model/User';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import User from '../../../models/user';

interface IRequest {
  name: string;
  description: string;
}

class CreateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  createJwt(user: User) {
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type
      },
      process.env.TOKEN_SECRET as jwt.Secret,
      {
        expiresIn: '2h'
      }
    );

    const response = {
      user_id: user.user_id,
      user_type: user.user_type,
      token
    };

    return response;
  }

  async execute({ login, password, user_type }: UserModel) {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userALreadyExists = await this.userRepository.findByLogin(login);
    const userModel = new UserModel();

    if (userALreadyExists)
      throw new Error('This Users already exists in database');

    Object.assign(userModel, {
      login,
      password: encryptedPassword,
      user_type
    });

    const newUser = await this.userRepository.create(userModel);
    const user = newUser[0];

    if (user) {
      return this.createJwt(user);
    }

    throw new Error('Failed to create user');
  }
}

export { CreateUserUseCase };
