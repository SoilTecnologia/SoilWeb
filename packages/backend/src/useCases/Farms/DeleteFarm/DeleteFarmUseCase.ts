import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteFarmUseCase {
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
        DeleteFarmUseCase.name,
        'Find Farm By Id'
      );
    }
  }

  private async applyQueryDeleteFarm(farm_id: string) {
    try {
      return await this.farmRepository.deleteFarm(farm_id);
    } catch (err) {
      messageErrorTryAction(err, true, DeleteFarmUseCase.name, 'Delete Farm');
    }
  }

  async execute(farm_id: FarmModel['farm_id']) {
    const farmExists = await this.applyQueryFindById(farm_id);

    if (farmExists) return await this.applyQueryDeleteFarm(farm_id);

    throw new Error('Farm Does Not Exists');
  }
}

export { DeleteFarmUseCase };
