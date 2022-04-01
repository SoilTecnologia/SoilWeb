import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: FarmsRepository
  ) {}

  private async findById(farm_id: string) {
    try {
      return await this.farmRepository.findById(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateFarmUseCase.name,
        'Find Farm By Id'
      );
    }
  }

  private async applyQueryCreateFarm(farm: FarmModel) {
    try {
      return await this.farmRepository.create(farm);
    } catch (err) {
      messageErrorTryAction(err, true, CreateFarmUseCase.name, 'Create Farm');
    }
  }

  async execute(farm: FarmModel) {
    const farmModel = new FarmModel();
    const farmAlreadExisty = await this.findById(farm.farm_id);

    if (farmAlreadExisty) throw new Error('Farm Already Exists');

    Object.assign(farmModel, farm);
    return await this.applyQueryCreateFarm(farmModel);
  }
}

export { CreateFarmUseCase };
