import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IFindFarmByIdRepo } from '@root/database/protocols/farms/find-by-farm_id/find';

class FindFarmByIdRepo implements IFindFarmByIdRepo {
  async find({
    farm_id
  }: IFindFarmByIdRepo.Params): Promise<IFindFarmByIdRepo.Response> {
    return await knex<FarmModel>('farms')
      .select('*')
      .where({ farm_id })
      .first();
  }
}

export { FindFarmByIdRepo };
