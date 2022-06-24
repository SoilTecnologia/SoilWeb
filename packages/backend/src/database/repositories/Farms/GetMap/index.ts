import knex from '@root/database';
import { IGetMapFarmRepo } from '@root/database/protocols/farms/get-map';

class GetMapFarmRepo implements IGetMapFarmRepo {
  async get({ farm_id }: IGetMapFarmRepo.Params): IGetMapFarmRepo.Response {
    const result: IGetMapFarmRepo.MapFarm[] | undefined = await knex('farms')
      .join('nodes', 'farms.farm_id', 'nodes.farm_id')
      .select('*');

    return result;
  }
}

export { GetMapFarmRepo };
