import { DatabaseError } from '@root/protocols/errors';

interface IGetByIdBaseRepo {
  get<R = any>({
    table,
    column,
    id
  }: IGetByIdBaseRepo.Params): IGetByIdBaseRepo.Response<R>;
}

namespace IGetByIdBaseRepo {
  export type Params = { table: string; column: string; id: string };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { IGetByIdBaseRepo };
