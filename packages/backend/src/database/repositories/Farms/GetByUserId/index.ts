import knex from '@root/database';
import { FarmModel } from '@root/database/model/Farm';
import { IGetFarmByUserIdRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetFarmByUserIdRepo implements IGetFarmByUserIdRepo {
  async getAll({
    user_id
  }: IGetFarmByUserIdRepo.Params): IGetFarmByUserIdRepo.Response {
    try {
      const farms = await knex<FarmModel>('farms').select().where({ user_id });

      return farms;
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetFarmByUserIdRepo.name,
        'Get Farm By User'
      );
      return DATABASE_ERROR;
    }
  }
}

export { GetFarmByUserIdRepo };
