import { DatabaseError } from '@root/protocols/errors';

interface IGetByIdBaseRepo<T = any> {
  get({
    table,
    column,
    id
  }: IGetByIdBaseRepo.Params): IGetByIdBaseRepo.Response<T>;
}

namespace IGetByIdBaseRepo {
  export type Params = { table: string; column: string; id: string };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { IGetByIdBaseRepo };
