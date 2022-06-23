import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IUpdateFarmRepo } from '@root/database/protocols';

class UpdateFarmRepo implements IUpdateFarmRepo {
  async update({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    farm_name,
    user_id
  }: FarmModel): Promise<IUpdateFarmRepo.Response> {
    const result = await knex<FarmModel>('farms')
      .where({ farm_id })
      .update({ farm_id, farm_city, farm_lat, farm_lng, farm_name, user_id })
      .returning('*');

    return result[0];
  }
}

export { UpdateFarmRepo };
