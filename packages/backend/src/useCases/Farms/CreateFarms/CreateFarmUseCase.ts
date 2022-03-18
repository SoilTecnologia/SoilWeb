import { FarmModel } from '../../../database/model/Farm';
import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';

class CreateFarmUseCase {
  constructor(private farmRepository: FarmsRepository) {}

  execute(farm: FarmModel) {
    const farmModel = new FarmModel();
    Object.assign(farmModel, farm);

    const result = this.farmRepository.create(farmModel);

    return result;
  }
}

export { CreateFarmUseCase };
