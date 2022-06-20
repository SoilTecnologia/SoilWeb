import { inject, injectable } from 'tsyringe';
import { FarmModel } from '@database/model/Farm';
import { IFarmsRepository } from '@database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '@utils/types';

@injectable()
class UpdateFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.farmRepository.findById(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateFarmUseCase.name,
        'Find Farm By Id'
      );
    }
  }

  private async applyQueryUpdateFarm(farm: FarmModel) {
    try {
      return await this.farmRepository.updateFarm(farm);
    } catch (err) {
      messageErrorTryAction(err, true, UpdateFarmUseCase.name, 'FUpdate Farm');
    }
  }

  async execute(farm: FarmModel) {
    const farmExists = await this.applyQueryFindById(farm.farm_id);

    if (!farmExists) throw new Error('Farms Doe Not Exists');

    return await this.applyQueryUpdateFarm(farm);
  }
}

export { UpdateFarmUseCase };
