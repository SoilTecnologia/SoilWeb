import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IDeleteFarmRepo } from '@root/database/protocols';

class DeleteFarmRepo implements IDeleteFarmRepo {
  async delete({ farm_id }: IDeleteFarmRepo.Params): IDeleteFarmRepo.Response {
    const delResult = await knex<FarmModel>('farms')
      .select()
      .where({ farm_id })
      .del();

    return delResult;
  }
}

export { DeleteFarmRepo };
