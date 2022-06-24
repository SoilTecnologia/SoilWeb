import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IGetFarmByUserIdRepo } from '@root/database/protocols';

class GetFarmByUserIdRepo implements IGetFarmByUserIdRepo {
  async getAll({
    user_id
  }: IGetFarmByUserIdRepo.Params): IGetFarmByUserIdRepo.Response {
    const farms = await knex<FarmModel>('farms').select().where({ user_id });

    return farms;
  }
}

export { GetFarmByUserIdRepo };
