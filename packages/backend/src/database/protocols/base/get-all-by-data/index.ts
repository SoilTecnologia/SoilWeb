import { DatabaseError } from '@root/protocols/errors';

interface IGetAllByDataBaseRepo {
  get<R = any>({
    table,
    column,
    where
  }: IGetAllByDataBaseRepo.Params): IGetAllByDataBaseRepo.Response<R>;
}

namespace IGetAllByDataBaseRepo {
  export type Params = { table: string; column: string; where: string };
  export type Response<T = any> = Promise<T[] | undefined | DatabaseError>;
}

export { IGetAllByDataBaseRepo };
