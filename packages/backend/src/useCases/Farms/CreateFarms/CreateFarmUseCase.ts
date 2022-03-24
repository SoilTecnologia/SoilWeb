import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';

@injectable()
class CreateFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: FarmsRepository
  ) {}

  async execute(farm: FarmModel) {
    const farmModel = new FarmModel();
    Object.assign(farmModel, farm);
    const result = await this.farmRepository.create(farmModel);

    return result;
  }
}

export { CreateFarmUseCase };
