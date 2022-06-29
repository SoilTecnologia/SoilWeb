import knex from '@root/database';
import { IGetAllByDataBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetAllByDataBaseRepo<T> implements IGetAllByDataBaseRepo<T> {
  async get({
    table,
    column,
    where
  }: IGetAllByDataBaseRepo.Params): IGetAllByDataBaseRepo.Response<T> {
    try {
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetAllByDataBaseRepo.name,
        `Table: ${table}, Column: ${column}`
      );
      return DATABASE_ERROR;
    }
    const response: T[] = await knex(table).select('*').where(column, where);
    return response;
  }
}

export { GetAllByDataBaseRepo };
