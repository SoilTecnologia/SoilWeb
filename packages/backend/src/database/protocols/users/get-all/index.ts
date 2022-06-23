import { UserModel } from '@root/database/model/User';

interface IGetAllUserRepo {
  getAll(): IGetAllUserRepo.Response;
}

namespace IGetAllUserRepo {
  export type Response = Promise<UserModel[] | undefined>;
}

export { IGetAllUserRepo };
