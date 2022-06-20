import { UserModel } from '@database/model/User';
import { ICreateUserUseCase } from '@root/useCases/contracts/users/create-user/create-user-protocol';

type AddUserModel = Omit<UserModel, 'user_id'>;

interface ICreateUserRepository {
  create(
    newUser: ICreateUserUseCase.Params
  ): Promise<ICreateUserRepository.Response>;
}

namespace ICreateUserRepository {
  export type Params = AddUserModel;
  export type Response = UserModel | undefined;
}

export { ICreateUserRepository };
