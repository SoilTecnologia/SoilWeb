import { IUpdateUserService } from '@root/useCases/contracts/users/update-user/update-user-protocol';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '@database/model/User';
import { messageErrorTryAction } from '@utils/types';
import { IFindUserByIdRepo } from '@root/database/protocols/users';
import { IUpdateUserRepo } from '@root/database/protocols/users/update/IUpdateUserRepo';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';
import { IEncrypter } from '../utils/encrypted-password/protocols';

@injectable()
class UpdateUserUseCase implements IUpdateUserService {
  constructor(
    @inject('FindUserById') private findUser: IFindUserByIdRepo,
    @inject('UpdateUser') private updateUser: IUpdateUserRepo,
    @inject('Encrypter') private encrypter: IEncrypter
  ) {}

  private async apllyQueryGetUserById(user_id: string) {
    try {
      return await this.findUser.findById({ id: user_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateUserUseCase.name,
        'Find User By Id'
      );

      return DATABASE_ERROR;
    }
  }

  private async apllyQueryUpdateUser(userModel: UserModel) {
    try {
      return await this.updateUser.update(userModel);
    } catch (err) {
      messageErrorTryAction(err, true, UpdateUserUseCase.name, 'Update User');
      return DATABASE_ERROR;
    }
  }

  async execute({
    login,
    password,
    user_type,
    user_id
  }: IUpdateUserService.Params): IUpdateUserService.Response {
    if (!password || !login || !user_type || !user_id)
      throw new ParamsInvalid();

    if (typeof password !== 'string') throw new TypeParamError('password');
    if (typeof login !== 'string') throw new TypeParamError('login');
    if (typeof user_type !== 'string') throw new TypeParamError('user_type');
    if (typeof user_id !== 'string') throw new TypeParamError('user_id');

    const userModel = new UserModel();

    const selectUser = await this.apllyQueryGetUserById(user_id);

    if (selectUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!selectUser) throw new DataNotFound('User');
    else {
      const encryptedPassword = await this.encrypter.encrypt({
        value: password
      });

      if (encryptedPassword === 'ENCRYPT ERROR')
        throw new Error('ENCRYPT ERROR');
      else {
        Object.assign(userModel, {
          user_id,
          login,
          password: encryptedPassword,
          user_type
        });
        const newUser = await this.apllyQueryUpdateUser(userModel);

        if (newUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!newUser) throw new NotUpdateError('User');
        else return newUser;
      }
    }
  }
}

export { UpdateUserUseCase };
