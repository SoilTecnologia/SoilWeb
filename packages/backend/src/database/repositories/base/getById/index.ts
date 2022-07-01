import knex from '@root/database';
import { IGetByIdBaseRepo } from '@root/database/protocols/base/getById';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetByIdBaseRepo implements IGetByIdBaseRepo {
  async get<R = any>({
    table,
    column,
    id
  }: IGetByIdBaseRepo.Params): IGetByIdBaseRepo.Response<R> {
    try {
      const data: R = await knex(table).select('*').where(column, id).first();

      return data;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetByIdBaseRepo.name,
        ` Tabela de query: ${table}, Coluna: ${column}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { GetByIdBaseRepo };
