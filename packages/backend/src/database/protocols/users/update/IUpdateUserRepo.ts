import { UserModel } from '@database/model/User';
import { IUpdateUserService } from '@root/useCases/contracts/users/update-user/update-user-protocol';

type AddUserModel = Omit<UserModel, 'user_id'>;

interface IUpdateUserRepo {
  update({
    login,
    password,
    user_type,
    user_id
  }: IUpdateUserService.Params): IUpdateUserService.Response;
}

namespace IUpdateUserRepo {
  export type Params = AddUserModel;
  export type Response = UserModel | undefined;
}

export { IUpdateUserRepo };
