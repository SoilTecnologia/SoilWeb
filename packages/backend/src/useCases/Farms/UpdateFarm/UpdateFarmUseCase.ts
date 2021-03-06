import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class UpdateFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute(farm: FarmModel) {
    const farmExists = await this.farmRepository.findById(farm.farm_id);

    if (farmExists) {
      const newFarm = await this.farmRepository.updateFarm(farm);

      return newFarm;
    }

    throw new Error('Farms Doe Not Exists');
  }
}

export { UpdateFarmUseCase };
