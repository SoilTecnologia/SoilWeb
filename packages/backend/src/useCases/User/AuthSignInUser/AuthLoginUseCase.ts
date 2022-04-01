import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class AuthSignInUseCase {
  private user: UserModel | undefined;

  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {
    this.user = undefined;
  }

  private async comparePassword(password: UserModel['password']) {
    try {
      if (password) {
        return await bcrypt.compare(password, this.user!!.password);
      }
      return false;
    } catch (err) {
      console.log('ERROR WHEN COMPARE PASSWORD');
      console.log(err.message);
    }
  }

  private generateTokenJwt() {
    const { user_id, user_type } = this.user!!;

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

  private async applyQuerie(login: UserModel['login']) {
    try {
      const user = await this.userRepository.findByLogin(login);

      this.user = user;
    } catch (err) {
      messageErrorTryAction(err, true, AuthSignInUseCase.name, 'LOGIN USER');
    }
  }

  async execute(login: UserModel['login'], password: UserModel['password']) {
    await this.applyQuerie(login);

    const comparePassword = await this.comparePassword(password);

    if (!this.user || !comparePassword) throw new Error('Invalid Credentials');
    else return this.generateTokenJwt();
  }
}

export { AuthSignInUseCase };
