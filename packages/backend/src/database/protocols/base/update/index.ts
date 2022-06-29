import { DatabaseError } from '@root/protocols/errors';

interface IUpdateBaseRepo<T = any> {
  put({
    table,
    column,
    where,
    data
  }: IUpdateBaseRepo.Params<T>): IUpdateBaseRepo.Response<T>;
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
