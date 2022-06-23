import { UserModel } from '@root/database/model/User';

interface IGetAllUserService {
  execute(): IGetAllUserService.Response;
}

namespace IGetAllUserService {
  export type Response = Promise<UserModel[]>;
}

export { IGetAllUserService };
