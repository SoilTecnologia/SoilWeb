import { DatabaseError } from '@root/protocols/errors';

interface ICreateBaseRepo {
  create<P = any, R = P>({
    table,
    data
  }: ICreateBaseRepo.Params<P>): ICreateBaseRepo.Response<R>;
}

namespace ICreateBaseRepo {
  export type Params<T = any> = { table: string; data: T };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { ICreateBaseRepo };
