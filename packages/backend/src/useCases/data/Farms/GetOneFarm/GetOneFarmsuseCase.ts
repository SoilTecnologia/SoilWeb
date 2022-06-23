import { inject, injectable } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  ParamsInvalid
} from '@root/protocols/errors';
import { IGetOneFarmService } from '@root/useCases/contracts';
import { IFindFarmByIdRepo } from '@root/database/protocols';

@injectable()
class GetOneFarmUseCase implements IGetOneFarmService {
  constructor(@inject('FindFarmById') private findFarm: IFindFarmByIdRepo) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.findFarm.find({ farm_id });
    } catch (err) {
      messageErrorTryAction(err, true, GetOneFarmUseCase.name, 'Get One Farm');
      return DATABASE_ERROR;
    }
  }

  async execute({
    farm_id
  }: IGetOneFarmService.Params): IGetOneFarmService.Response {
    if (farm_id === 'undefined' || farm_id === 'null') {
      throw new ParamsInvalid();
    } else {
      const farm = await this.applyQueryFindById(farm_id);
      if (farm === DATABASE_ERROR) throw new DatabaseErrorReturn();
      else return farm;
    }
  }
}

export { GetOneFarmUseCase };
