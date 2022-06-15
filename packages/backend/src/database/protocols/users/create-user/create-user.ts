import { UserModel } from '../../../model/User';
import { IFindUserByLogin } from '../find-user-by-login/IFindByLoginRepository';

type AddUserModel = Omit<UserModel, "user_id">

interface UserResponseData  {
  user_id: string | undefined;
  user_type: "USER" | "SUDO";
  token: string;
}

interface ICreateUserUseCase {
  execute(account: ICreateUserUseCase.Params): Promise<ICreateUserUseCase.Response>;
}

interface ICreateUserRepository{
  create(newUser: ICreateUserUseCase.Params): Promise<ICreateUserRepository.Response>;
}


namespace ICreateUserUseCase {
  export type Params = AddUserModel

  export type Response = UserResponseData | Error

  export type Dependencies = ICreateUserRepository & IFindUserByLogin
  
}

namespace ICreateUserRepository {
  export type Params = AddUserModel
  export type Response = UserModel | undefined
}

export { 
  ICreateUserUseCase,
  AddUserModel,
  UserResponseData,
  ICreateUserRepository  
};