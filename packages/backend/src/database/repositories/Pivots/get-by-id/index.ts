import knex from '@root/database';
import { PivotModel } from '@root/database/model/Pivot';
import { IGetPivotByIdRepo } from '@root/database/protocols/pivots/get-by-id';

class GetPivotByIdRepo implements IGetPivotByIdRepo {
  async get({ pivot_id }: IGetPivotByIdRepo.Params): IGetPivotByIdRepo.Rsponse {
    return await knex<PivotModel>('pivots')
      .select()
      .where({ pivot_id })
      .first();
  }
}

export { GetPivotByIdRepo };
