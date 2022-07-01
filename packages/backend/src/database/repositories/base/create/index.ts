import knex from '@root/database';
import { ICreateBaseRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class CreateBaseRepo implements ICreateBaseRepo {
  async create<P = any, R = P>({
    table,
    data
  }: ICreateBaseRepo.Params<P>): ICreateBaseRepo.Response<R> {
    try {
      const response: R[] = await knex(table).insert(data).returning('*');
      return response[0];
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        CreateBaseRepo.name,
        `Tabela de Query ${table}`
      );
      return DATABASE_ERROR;
    }
  }
}

export { CreateBaseRepo };
