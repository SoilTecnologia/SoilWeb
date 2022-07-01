import { DatabaseError } from '@root/protocols/errors';

interface IUpdateBaseRepo {
  put<P = any, R = P>({
    table,
    column,
    where,
    data
  }: IUpdateBaseRepo.Params<P>): IUpdateBaseRepo.Response<R>;
}

namespace IUpdateBaseRepo {
  export type Params<T> = {
    table: string;
    column: string;
    where: string;
    data: T;
  };
  export type Response<T> = Promise<T | undefined | DatabaseError>;
}

export { IUpdateBaseRepo };
