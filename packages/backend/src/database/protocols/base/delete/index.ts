import { DatabaseError } from '@root/protocols/errors';

interface IDeleteBaseRepo<T = any> {
  del({
    table,
    column,
    data
  }: IDeleteBaseRepo.Params): IDeleteBaseRepo.Response<T>;
}

namespace IDeleteBaseRepo {
  export type Params = { table: string; column: string; data: string };
  export type Response<T> = Promise<undefined | number | DatabaseError>;
}

export { IDeleteBaseRepo };
