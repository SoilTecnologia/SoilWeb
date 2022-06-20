import { UserModel } from '@database/model/User';

interface ITokenJwt {
  create(user: ITokenJwt.Params): Promise<ITokenJwt.Response>;
}

namespace ITokenJwt {
  export type Params = UserModel;
  export type Response = string | null;
}

export { ITokenJwt };
