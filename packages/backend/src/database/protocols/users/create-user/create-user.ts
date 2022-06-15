import { UserModel } from '../../../model/User';
import { NextFunction, Request, Response } from 'express';
import { ParamsHandlerController } from '@root/protocols/express';

type AddUserModel = Omit<UserModel, 'user_id'>;

interface UserResponseData {
  user_id: string | undefined;
  user_type: 'USER' | 'SUDO';
  token: string;
}

interface ICreateUserUseCase {
  execute(
    account: ICreateUserUseCase.Params
  ): Promise<ICreateUserUseCase.Response>;
}

interface ICreateUserController {
  handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined>;
}

interface ICreateUserRepository {
  create(
    newUser: ICreateUserUseCase.Params
  ): Promise<ICreateUserRepository.Response>;
}

namespace ICreateUserUseCase {
  export type Params = AddUserModel;

  export type Response = UserResponseData | Error;
}

namespace ICreateUserController {
  export type Params = ParamsHandlerController;
}

namespace ICreateUserRepository {
  export type Params = AddUserModel;
  export type Response = UserModel | undefined;
}

export {
  ICreateUserUseCase,
  AddUserModel,
  UserResponseData,
  ICreateUserRepository,
  ICreateUserController
};
