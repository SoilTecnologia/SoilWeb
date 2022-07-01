import { inject, injectable } from 'tsyringe';
import { UserModel } from '@database/model/User';
import { messageErrorTryAction } from '@utils/types';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsEquals
} from '@root/protocols/errors';
import { IEncrypter, ICompareEncrypt } from '@useCases/data';
import { IUpdateUserService } from '@root/useCases/contracts';
import { checkStrings } from '@root/utils/decorators/check-types';

@injectable()
class UpdateUserUseCase implements IUpdateUserService {
  private passwordEqual: boolean;
  private newPassword: string;

  constructor(
    @inject('GetByIdBase') private getById: IGetByIdBaseRepo,
    @inject('UpdateBase') private updateUser: IUpdateBaseRepo,
    @inject('Encrypter') private encrypter: IEncrypter,
    @inject('CompareEncrypt') private compareEncrypter: ICompareEncrypt
  ) {
    this.passwordEqual = false;
  }

  private async checkObjectIsEquals(
    oldUser: UserModel,
    newUser: UserModel
  ): Promise<boolean | 'BCRYPT COMPARE ERROR'> {
    const comparePassword = await this.compareEncrypter.compare({
      password: newUser.password,
      password_encrypted: oldUser.password
    });

    if (comparePassword === 'BCRYPT COMPARE ERROR') {
      return 'BCRYPT COMPARE ERROR';
    } else {
      this.passwordEqual = comparePassword || false;

      if (
        oldUser.login === newUser.login &&
        oldUser.user_type === newUser.user_type &&
        comparePassword
      ) {
        return true;
      } else return false;
    }
  }

  private async encryptNewPassword(password: string) {
    const encryptedPassword = await this.encrypter.encrypt({
      value: password
    });

    if (encryptedPassword === 'ENCRYPT ERROR') {
      throw new Error('ENCRYPT ERROR');
    } else {
      this.newPassword = encryptedPassword;
    }
  }

  @checkStrings()
  async execute({
    login,
    password,
    user_type,
    user_id
  }: IUpdateUserService.Params): IUpdateUserService.Response {
    /*
      Check User by Id And checking error database
    */

    const selectUser = await this.getById.get<UserModel>({
      table: 'users',
      column: 'user_id',
      id: user_id!
    });

    if (selectUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!selectUser) throw new DataNotFound('User');
    else {
      /*
                      Check Compare Passwords
      */

      const isEquals = await this.checkObjectIsEquals(selectUser, {
        login,
        password,
        user_type,
        user_id
      });

      /*
        Check new data is Equal a old data, for verification if is necessary update
      */

      if (isEquals === 'BCRYPT COMPARE ERROR') {
        throw new Error('BCRYPT COMPARE ERROR');
      } else if (isEquals) {
        throw new ParamsEquals();
      } else {
        /*
                      Check if necessary Encrypter a new Password
        */

        if (!this.passwordEqual) await this.encryptNewPassword(password);

        const user = {
          login,
          user_type,
          user_id,
          password: this.newPassword ?? password
        };

        /*
          Check if update user with sucessfully and return a new user
        */

        const newUser = await this.updateUser.put<UserModel>({
          table: 'users',
          column: 'user_id',
          where: user.user_id!,
          data: user
        });

        if (newUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else if (!newUser) throw new NotUpdateError('User');
        else return newUser;
      }
    }
  }
}

export { UpdateUserUseCase };
