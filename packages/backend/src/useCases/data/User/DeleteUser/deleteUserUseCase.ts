import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid
} from '@root/protocols/errors';
import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { IDeleteUserService } from '@root/useCases/contracts';
import { UserModel } from '@root/database/model/User';

@injectable()
class DeleteUserUseCase implements IDeleteUserService {
  constructor(
    @inject('GetByIdBase') private findById: IGetByIdBaseRepo<UserModel>,
    @inject('DeleteBase') private deleteUser: IDeleteBaseRepo<UserModel>
  ) {}

  private async apllyQueryFindUser(user_id: string) {
    try {
      return await this.findById.get({
        table: 'users',
        column: 'user_id',
        id: user_id
      });
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
      return await this.deleteUser.del({
        table: 'users',
        data: user_id,
        column: 'user_id'
      });
    } catch (err) {
      messageErrorTryAction(err, true, DeleteUserUseCase.name, 'DELETE USER');
      return DATABASE_ERROR;
    }
  }

  async execute({
    user_id
  }: IDeleteUserService.Params): IDeleteUserService.Response {
    if (user_id === 'undefined' || user_id === 'null') {
      throw new ParamsInvalid();
    } else {
      const selectUser = await this.apllyQueryFindUser(user_id);

      if (selectUser === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (!selectUser) throw new DataNotFound('User');
      else {
        const del = await this.applyQueryDeleteUser(user_id);

        if (del === DATABASE_ERROR) throw new DatabaseErrorReturn();
        else return { status: del ? 'OK' : 'FAIL' };
      }
    }
  }
}

export { DeleteUserUseCase };
