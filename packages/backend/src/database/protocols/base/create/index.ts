import { DatabaseError } from '@root/protocols/errors';

interface ICreateBaseRepo<T = any> {
  create({
    table,
    data
  }: ICreateBaseRepo.Params<T>): ICreateBaseRepo.Response<T>;
}

namespace ICreateBaseRepo {
  export type Params<T = any> = { table: string; data: T };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { ICreateBaseRepo };
