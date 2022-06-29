import { DatabaseError } from '@root/protocols/errors';

interface IGetAllBaseRepo<T = any> {
  get({ table }: IGetAllBaseRepo.Params): IGetAllBaseRepo.Response<T>;
}

namespace IGetAllBaseRepo {
  export type Params = { table: string };

  export type Response<T = any> = Promise<T[] | undefined | DatabaseError>;
}

export { IGetAllBaseRepo };
