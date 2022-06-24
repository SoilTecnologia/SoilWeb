import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IGetAllFarmsRepo } from '@root/database/protocols';

class GetAllFarmsRepo implements IGetAllFarmsRepo {
  async getAll(): IGetAllFarmsRepo.Response {
    return await knex<FarmModel>('farms').select();
  }
}
export { GetAllFarmsRepo };
