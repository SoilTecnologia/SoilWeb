import { UserModel } from '@root/database/model/User';

interface IFindUserByIdRepo {
  findById({ id }: IFindUserByIdRepo.Params): IFindUserByIdRepo.Response;
}

namespace IFindUserByIdRepo {
  export type Params = { id: string };
  export type Response = Promise<UserModel | undefined>;
}

export { IFindUserByIdRepo };
