import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class GetMapFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepositor: IFarmsRepository
  ) {}

  execute(farm_id: FarmModel['farm_id']) {
    const dataFarms = this.farmRepositor.getMapFarm(farm_id);

    return dataFarms;
  }
}

export { GetMapFarmUseCase };
