import { UserModel } from '@root/database/model/User';

interface IUpdateUserService {
  execute({
    login,
    password,
    user_type,
    user_id
  }: IUpdateUserService.Params): IUpdateUserService.Response;
}

namespace IUpdateUserService {
  export type Params = UserModel;
  export type Response = Promise<UserModel | undefined>;
}

export { IUpdateUserService };
