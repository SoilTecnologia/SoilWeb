import { IGetByDataRepo } from '@root/database/protocols';
import {
  DatabaseError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  FailedCreateDataError,
  InvalidCredentials
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '@database/model/User';
import { ICompareEncrypt, ITokenJwt } from '@useCases/data/User';
import { ILoginAuth } from '@root/useCases/contracts/users/';
import { checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class AuthSignInUseCase implements ILoginAuth {
  constructor(
    @inject('TokenJwt') private tokenJwt: ITokenJwt,
    @inject('CompareEncrypt') private bcryptCompare: ICompareEncrypt,
    @inject('GetByData') private getByData: IGetByDataRepo
  ) {}

  @checkStrings()
  async execute({ login, password }: ILoginAuth.Params): ILoginAuth.Response {
    const user = await this.getByData.get<UserModel>({
      table: 'users',
      column: 'login',
      data: login.toLowerCase()
    });

    if (user === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!user) throw new InvalidCredentials();
    else {
      const comparePassword = await this.bcryptCompare.compare({
        password,
        password_encrypted: user.password!!
      });

      if (comparePassword === 'BCRYPT COMPARE ERROR') {
        throw new Error('BCRYPT COMPARE ERROR');
      } else if (!comparePassword) throw new InvalidCredentials();
      else {
        const tokenResponse = await this.tokenJwt.create(user);
        if (!tokenResponse) throw new FailedCreateDataError('token jwt');

        return {
          user_type: user.user_type,
          user_id: user.user_id!,
          token: tokenResponse
        };
      }
    }
  }
}

export { AuthSignInUseCase };
