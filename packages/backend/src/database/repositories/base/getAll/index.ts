import knex from '@root/database';
import { IGetAllBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetAllBaseRepo implements IGetAllBaseRepo {
  async get<R = any>({
    table
  }: IGetAllBaseRepo.Params): IGetAllBaseRepo.Response<R> {
    try {
      const value: R[] = await knex(table).select('*');
      return value;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetAllBaseRepo.name,
        ` Tabela de query: ${table}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { GetAllBaseRepo };
