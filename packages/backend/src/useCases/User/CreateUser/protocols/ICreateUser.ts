import { UserModel } from '../../../../database/model/User';

type AddUserModel = Omit<UserModel, "user_id">

interface UserResponse  {
  user_id: string | undefined;
  user_type: "USER" | "SUDO";
  token: string;
}

interface ICreateUserUseCase {
  execute(account: AddUserModel): Promise<UserResponse >;
}

export { ICreateUserUseCase, AddUserModel, UserResponse };