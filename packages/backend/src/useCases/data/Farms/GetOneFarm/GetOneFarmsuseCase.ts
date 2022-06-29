import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  ParamsInvalid
} from '@root/protocols/errors';
import { IGetOneFarmService } from '@root/useCases/contracts';
import { IGetByIdBaseRepo } from '@root/database/protocols';
import { FarmModel } from '@root/database/model/Farm';

@injectable()
class GetOneFarmUseCase implements IGetOneFarmService {
  constructor(
    @inject('GetByIdBase') private findFarm: IGetByIdBaseRepo<FarmModel>
  ) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.get({
        table: 'farms',
        column: 'farm_id',
        id: farm_id
      });
    } catch (err) {
      messageErrorTryAction(err, true, GetOneFarmUseCase.name, 'Get One Farm');
      return DATABASE_ERROR;
    }
  }

  async execute({
    farm_id
  }: IGetOneFarmService.Params): IGetOneFarmService.Response {
    if (farm_id === 'undefined' || farm_id === 'null')
      throw new ParamsInvalid();
    else {
      const farm = await this.applyQueryFindById(farm_id);
      if (farm === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else if (farm === undefined) throw new DataNotFound('Farm');
      else return farm;
    }
  }
}

export { GetOneFarmUseCase };
