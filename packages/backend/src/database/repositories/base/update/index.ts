import knex from '@root/database';
import { IUpdateBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class UpdateBaseRepo<T = any> implements IUpdateBaseRepo<T> {
  async put({
    table,
    column,
    where,
    data
  }: IUpdateBaseRepo.Params<T>): IUpdateBaseRepo.Response<T> {
    try {
      const result = await knex(table)
        .where(column, where)
        .update(data)
        .returning('*');

      return result[0];
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        UpdateBaseRepo.name,
        ` Tabela de query: ${table}, Coluna: ${column}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { UpdateBaseRepo };
