import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class DeleteFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute(farm_id: FarmModel['farm_id']) {
    const farmExists = await this.farmRepository.findById(farm_id);

    if (farmExists) {
      const farm = await this.farmRepository.deleteFarm(farm_id);

      return farm;
    }

    throw new Error('Farm Does Not Exists');
  }
}

export { DeleteFarmUseCase };
