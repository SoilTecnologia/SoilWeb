import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetMapFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepositor: IFarmsRepository
  ) {}

  private async applyQueryGetMapFarm(farm_id: string) {
    try {
      return await this.farmRepositor.getMapFarm(farm_id);
    } catch (err) {
      messageErrorTryAction(err, true, GetMapFarmUseCase.name, 'Get Map farms');
    }
  }

  async execute(farm_id: FarmModel['farm_id']) {
    const dataFarms = await this.applyQueryGetMapFarm(farm_id);

    return dataFarms;
  }
}

export { GetMapFarmUseCase };
