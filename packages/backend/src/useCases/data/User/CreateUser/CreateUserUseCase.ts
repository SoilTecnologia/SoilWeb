import { inject, injectable } from 'tsyringe';
import { UserModel } from '@database/model/User';
import { messageErrorTryAction } from '@utils/types';
import {
  AlreadyExistsError,
  DatabaseError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  FailedCreateDataError,
  ParamsInvalid,
  TypeParamError
} from '@protocols/errors';
import { IEncrypter, ITokenJwt } from '@useCases/data/User';
import { ICreateUserUseCase } from '@useCases/contracts/users/';
import {
  ICreateUserRepository,
  IFindUserByLoginRepo
} from '@root/database/protocols';

@injectable()
class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject('TokenJwt') private tokenJwt: ITokenJwt,
    @inject('Encrypter') private encrypter: IEncrypter,
    @inject('AddUser') private addUserRepo: ICreateUserRepository,
    @inject('FindUserByLogin') private findUserRepo: IFindUserByLoginRepo
  ) {}

  private async apllyQueryFindUser(
    login: UserModel['login']
  ): Promise<IFindUserByLoginRepo.Response | DatabaseError> {
    try {
      return await this.findUserRepo.findUserByLogin(login);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        'FindUser By Login'
      );
      return DATABASE_ERROR;
    }
  }

  private async apllyQueryCreateUser(
    user: ICreateUserUseCase.Params
  ): Promise<ICreateUserRepository.Response | DatabaseError> {
    try {
      return await this.addUserRepo.create(user);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        'CREATE NEW USER'
      );
      return DATABASE_ERROR;
    }
  }

  async execute(
    user: ICreateUserUseCase.Params
  ): Promise<ICreateUserUseCase.Response> {
    const { password, login, user_type } = user;

    if (!password || !login || !user_type) throw new ParamsInvalid();
    if (typeof password !== 'string') throw new TypeParamError('password');
    if (typeof login !== 'string') throw new TypeParamError('login');
    if (typeof user_type !== 'string') throw new TypeParamError('user_type');

    const encryptedPassword = await this.encrypter.encrypt({ value: password });

    if (encryptedPassword === 'ENCRYPT ERROR') throw new Error('ENCRYPT ERROR');

    const userALreadyExists = await this.apllyQueryFindUser(
      login.toLowerCase()
    );

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
