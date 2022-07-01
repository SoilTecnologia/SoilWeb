import { DatabaseError } from '@root/protocols/errors';

interface IGetAllBaseRepo {
  get<R = any>({ table }: IGetAllBaseRepo.Params): IGetAllBaseRepo.Response<R>;
}

namespace IGetAllBaseRepo {
  export type Params = { table: string };

  export type Response<T = any> = Promise<T[] | undefined | DatabaseError>;
}

export { IGetAllBaseRepo };
