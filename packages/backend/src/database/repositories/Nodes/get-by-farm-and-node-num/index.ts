import knex from '@root/database';
import { NodeModel } from '@root/database/model/Node';
import { IGetByFarmAndNodeNumRepo } from '@root/database/protocols';
import { DATABASE_ERROR } from '@root/protocols/errors';
import { messageErrorTryAction } from '@root/utils/types';

class GetByfarmAndNodeNumRepo implements IGetByFarmAndNodeNumRepo {
  async get({
    farm_id,
    node_num
  }: IGetByFarmAndNodeNumRepo.Params): IGetByFarmAndNodeNumRepo.Response {
    try {
      const response = await knex<NodeModel>('nodes')
        .select()
        .where({ farm_id, node_num })
        .first();

      return response;
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        GetByfarmAndNodeNumRepo.name,
        'Get Node By Farm'
      );

      return DATABASE_ERROR;
    }
  }
}

export { GetByfarmAndNodeNumRepo };
