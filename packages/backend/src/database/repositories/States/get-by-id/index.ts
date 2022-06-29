import knex from '@root/database';
import { StateModel } from '@root/database/model/State';
import { IGetStateByIdRepo } from '@root/database/protocols';

class GetStateByIdRepo implements IGetStateByIdRepo {
  async get({
    state_id
  }: IGetStateByIdRepo.Params): IGetStateByIdRepo.Response {
    return await knex<StateModel>('states')
      .select()
      .where({ state_id })
      .orderBy('timestamp', 'desc')
      .first();
  }
}

export { GetStateByIdRepo };
