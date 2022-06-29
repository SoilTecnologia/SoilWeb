import { DatabaseError } from '@root/protocols/errors';

interface IGetByDataRepo<T = any> {
  get({
    table,
    column,
    data
  }: IGetByDataRepo.Params): IGetByDataRepo.Response<T>;
}

namespace IGetByDataRepo {
  export type Params = { table: string; column: string; data: string };
  export type Response<T = any> = Promise<T | undefined | DatabaseError>;
}

export { IGetByDataRepo };
