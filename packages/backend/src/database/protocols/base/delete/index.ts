import { DatabaseError } from '@root/protocols/errors';

interface IDeleteBaseRepo {
  del({
    table,
    column,
    data
  }: IDeleteBaseRepo.Params): IDeleteBaseRepo.Response;
}

namespace IDeleteBaseRepo {
  export type Params = { table: string; column: string; data: string };
  export type Response = Promise<undefined | number | DatabaseError>;
}

export { IDeleteBaseRepo };
