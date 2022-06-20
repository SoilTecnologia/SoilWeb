import { inject, injectable } from 'tsyringe';
import { IFarmsRepository } from '@database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '@utils/types';

@injectable()
class GetOneFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  private async applyQueryFindById(farm_id: string) {
    try {
      return await this.farmRepository.findById(farm_id);
    } catch (err) {
      messageErrorTryAction(err, true, GetOneFarmUseCase.name, 'Get One Farm');
    }
  }

  async execute(farm_id: string) {
    return await this.applyQueryFindById(farm_id);
  }
}

export { GetOneFarmUseCase };
