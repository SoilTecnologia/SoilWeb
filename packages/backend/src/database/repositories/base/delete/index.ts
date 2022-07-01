import knex from '@root/database';
import { IDeleteBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class DeleteBaseRepo implements IDeleteBaseRepo {
  async del({
    table,
    column,
    data
  }: IDeleteBaseRepo.Params): IDeleteBaseRepo.Response {
    try {
      const response = await knex(table).select().where(column, data).del();

      return response;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        DeleteBaseRepo.name,
        ` Tabela de query: ${table}, Coluna: ${column}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { DeleteBaseRepo };
