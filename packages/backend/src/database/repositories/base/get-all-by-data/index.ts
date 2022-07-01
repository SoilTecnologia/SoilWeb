import knex from '@root/database';
import { IGetAllByDataBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetAllByDataBaseRepo implements IGetAllByDataBaseRepo {
  async get<R = any>({
    table,
    column,
    where
  }: IGetAllByDataBaseRepo.Params): IGetAllByDataBaseRepo.Response<R> {
    try {
      const response: R[] = await knex(table).select('*').where(column, where);
      return response;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetAllByDataBaseRepo.name,
        `Table: ${table}, Column: ${column}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { GetAllByDataBaseRepo };
