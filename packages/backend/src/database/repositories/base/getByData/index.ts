import knex from '@root/database';
import { IGetByDataRepo } from '@root/database/protocols/base/getByData';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetByDataRepo<T> implements IGetByDataRepo {
  async get<R = any>({
    table,
    column,
    data
  }: IGetByDataRepo.Params): IGetByDataRepo.Response<R> {
    try {
      const response: R = await knex(table)
        .select('*')
        .where(column, data)
        .first();
      return response;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetByDataRepo.name,
        ` Tabela de query: ${table}, Coluna: ${column}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { GetByDataRepo };
