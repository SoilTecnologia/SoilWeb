import { UserModel } from '@root/database/model/User';

type userLoginReceived = { login: string; password: string };
type userLoginResponse = {
  user_id: string;
  user_type: UserModel['user_type'];
  token: string;
};

interface ILoginAuth {
  execute({ login, password }: ILoginAuth.Params): ILoginAuth.Response;
}

namespace ILoginAuth {
  export type Params = userLoginReceived;
  export type Response = Promise<userLoginResponse | Error>;
}

export { ILoginAuth };
