import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { ICreateFarmRepo } from '@root/database/protocols';

class CreateFarmRepo implements ICreateFarmRepo {
  async create(
    newFarm: ICreateFarmRepo.Params
  ): Promise<ICreateFarmRepo.Response> {
    const farm = await knex<FarmModel>('farms').insert(newFarm).returning('*');

    return farm[0];
  }
}

export { CreateFarmRepo };
