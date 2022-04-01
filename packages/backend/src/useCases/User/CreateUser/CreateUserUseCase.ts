import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  createJwt(user: UserModel) {
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

  private async apllyQueryFindUser(login: UserModel['login']) {
    try {
      return await this.userRepository.findByLogin(login);
    } catch (err) {
      messageErrorTryAction(err, true, 'FIND USER EXISTS');
    }
  }

  private async apllyQueryCreateUser(user: UserModel) {
    try {
      return await this.userRepository.create(user);
    } catch (err) {
      messageErrorTryAction(err, true, 'CREATE NEW USER');
    }
  }

  async execute({ login, password, user_type }: UserModel) {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userALreadyExists = await this.apllyQueryFindUser(login);

    const userModel = new UserModel();

    if (userALreadyExists)
      throw new Error('This Users already exists in database');

    Object.assign(userModel, {
      login,
      password: encryptedPassword,
      user_type
    });

    const newUser = await this.apllyQueryCreateUser(userModel);

    if (newUser) return this.createJwt(newUser[0]);

    throw new Error('Failed to create user');
  }
}

export { CreateUserUseCase };
