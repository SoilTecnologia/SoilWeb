import { inject, injectable } from 'tsyringe';
import { UserModel } from '@database/model/User';
import { messageErrorTryAction } from '@utils/types';
import {
  AlreadyExistsError,
  DatabaseError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  FailedCreateDataError
} from '@protocols/errors';
import { IEncrypter, ITokenJwt } from '@useCases/data/User';
import { ICreateUserUseCase } from '@useCases/contracts/users/';
import { ICreateBaseRepo, IGetByDataRepo } from '@root/database/protocols';
import { checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject('TokenJwt') private tokenJwt: ITokenJwt,
    @inject('Encrypter') private encrypter: IEncrypter,
    @inject('CreateBaseRepo') private addUserRepo: ICreateBaseRepo<UserModel>,
    @inject('GetByData') private findUserRepo: IGetByDataRepo<UserModel>
  ) {}

  private async apllyQueryFindUser(
    login: UserModel['login']
  ): Promise<IGetByDataRepo.Response<UserModel> | DatabaseError> {
    try {
      return await this.findUserRepo.get({
        table: 'users',
        column: 'login',
        data: login
      });
    } catch (err) {
      messageErrorTryAction(err, true, CreateUserUseCase.name, 'Find User');
      return DATABASE_ERROR;
    }
  }

  private async apllyQueryCreateUser(
    user: ICreateUserUseCase.Params
  ): Promise<ICreateBaseRepo.Response<UserModel> | DatabaseError> {
    try {
      return await this.addUserRepo.create({ table: 'users', data: user });
    } catch (err) {
      messageErrorTryAction(err, true, CreateUserUseCase.name, 'Create User');
      return DATABASE_ERROR;
    }
  }

  @checkStrings()
  async execute(
    user: ICreateUserUseCase.Params
  ): Promise<ICreateUserUseCase.Response> {
    const { password, login, user_type } = user;

    const encryptedPassword = await this.encrypter.encrypt({ value: password });

    if (encryptedPassword === 'ENCRYPT ERROR') throw new Error('ENCRYPT ERROR');

    const userALreadyExists = await this.apllyQueryFindUser(login);

    if (userALreadyExists === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (userALreadyExists) throw new AlreadyExistsError('User');
    else {
      const userModel = new UserModel();

      Object.assign(userModel, {
        login: login.toLowerCase(),
        password: encryptedPassword,
        user_type
      });

      const newUser = await this.apllyQueryCreateUser(userModel);

      if (newUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!newUser) throw new FailedCreateDataError('User');
      else {
        const token = await this.tokenJwt.create(newUser);
        if (!token) throw new FailedCreateDataError('token jwt');
        else {
          return {
            user_id: newUser.user_id,
            user_type: newUser.user_type,
            token: token
          };
        }
      }
    }
  }
}

export { CreateUserUseCase };
