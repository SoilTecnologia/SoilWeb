import { DatabaseError } from '@root/protocols/errors';

interface IGetByDataRepo {
  get<R = any>({
    table,
    column,
    data
  }: IGetByDataRepo.Params): IGetByDataRepo.Response<R>;
}

namespace IGetByDataRepo {
  export type Params = { table: string; column: string; data: string };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { IGetByDataRepo };
