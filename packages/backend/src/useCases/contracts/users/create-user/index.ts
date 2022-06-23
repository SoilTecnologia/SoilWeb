import { UserModel } from '@root/database/model/User';

type AddUserModel = Omit<UserModel, 'user_id'>;

type UserResponseData = {
  user_id: string | undefined;
  user_type: 'USER' | 'SUDO';
  token: string;
};

interface ICreateUserUseCase {
  execute(
    account: ICreateUserUseCase.Params
  ): Promise<ICreateUserUseCase.Response>;
}

namespace ICreateUserUseCase {
  export type Params = AddUserModel;

  export type Response = UserResponseData | Error;
}

export { ICreateUserUseCase, UserResponseData };
