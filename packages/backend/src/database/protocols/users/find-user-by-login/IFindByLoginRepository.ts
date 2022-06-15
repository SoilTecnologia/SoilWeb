import { UserModel } from '@database/model/User';

interface IFindUserByLogin {
  findUserByLogin(
    login: IFindUserByLogin.Params
  ): Promise<IFindUserByLogin.Response>;
}

namespace IFindUserByLogin {
  export type Params = UserModel['login'];
  export type Response = UserModel | undefined;
}

export { IFindUserByLogin };
