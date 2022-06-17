import { IFindUserByLogin } from '@root/database/protocols/users';
import { ILoginAuth } from '@root/database/protocols/users/auth-login/login-auth';
import { TypeParamError } from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { messageErrorTryAction } from '../../../utils/types';
import { ICompareEncrypt } from '../utils/encrypted-password/protocols';
import { ITokenJwt } from '../utils/token-jwt/protocols';

@injectable()
class AuthSignInUseCase implements ILoginAuth {
  constructor(
    @inject('TokenJwt') private tokenJwt: ITokenJwt,
    @inject('CompareEncrypt') private bcryptCompare: ICompareEncrypt,
    @inject('UsersRepository') private findUserByLogin: IFindUserByLogin
  ) {}

  private async applyQuerie(login: UserModel['login']) {
    try {
      return await this.findUserByLogin.findUserByLogin(login);
    } catch (err) {
      messageErrorTryAction(err, true, AuthSignInUseCase.name, 'LOGIN USER');
    }
  }

  async execute({ login, password }: ILoginAuth.Params): ILoginAuth.Response {
    if (!password || !login) throw new Error('Params inválids');
    if (typeof password !== 'string') throw new TypeParamError('password');
    if (typeof login !== 'string') throw new TypeParamError('login');

    const user = await this.applyQuerie(login.toLowerCase());
    const comparePassword = await this.bcryptCompare.compare({
      password,
      password_encrypted: user?.password!!
    });

    if (!user || !comparePassword) throw new Error('Invalid Credentials');
    else {
      const tokenResponse = await this.tokenJwt.create(user);
      if (!tokenResponse) throw new Error('Does not create token jwt');

      return {
        user_type: user.user_type,
        user_id: user.user_id!,
        token: tokenResponse
      };
    }
  }
}

export { AuthSignInUseCase };
