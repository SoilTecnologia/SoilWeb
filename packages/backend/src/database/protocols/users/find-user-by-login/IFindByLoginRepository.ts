import { UserModel } from '@database/model/User';

interface IFindUserByLoginRepo {
  findUserByLogin(
    login: IFindUserByLoginRepo.Params
  ): Promise<IFindUserByLoginRepo.Response>;
}

namespace IFindUserByLoginRepo {
  export type Params = UserModel['login'];
  export type Response = UserModel | undefined;
}

export { IFindUserByLoginRepo };
