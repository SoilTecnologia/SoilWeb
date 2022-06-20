import { IDeleteUserRepo } from '@root/database/protocols/users/delete-user/IDeleteUser';
import { IFindUserByIdRepo } from '@root/database/protocols/users/find-by-id/IFindByIdRepository';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  ParamsInvalid,
  TypeParamError
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { IDeleteUserService } from '@root/useCases/contracts/users/delete-user/del-user-protocol';

@injectable()
class DeleteUserUseCase implements IDeleteUserService {
  constructor(
    @inject('FindUserById') private findById: IFindUserByIdRepo,
    @inject('DeleteUser') private deleteUser: IDeleteUserRepo
  ) {}

  private async apllyQueryFindUser(user_id: string) {
    try {
      return await this.findById.findById({ id: user_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteUserUseCase.name,
        'Find User By Id'
      );
      return DATABASE_ERROR;
    }
  }

  private async applyQueryDeleteUser(user_id: string) {
    try {
      return await this.deleteUser.deleteUser({ user_id });
    } catch (err) {
      messageErrorTryAction(err, true, DeleteUserUseCase.name, 'DELETE USER');
      return DATABASE_ERROR;
    }
  }

  async execute({
    user_id
  }: IDeleteUserService.Params): IDeleteUserService.Response {
    const selectUser = await this.apllyQueryFindUser(user_id);

    if (selectUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!selectUser) throw new Error('User does not exists');
    else {
      const del = await this.applyQueryDeleteUser(user_id);

      if (del === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else return { status: del ? 'OK' : 'FAIL' };
    }
  }
}

export { DeleteUserUseCase };
