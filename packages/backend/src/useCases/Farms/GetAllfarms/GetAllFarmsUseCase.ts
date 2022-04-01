import { inject, injectable } from 'tsyringe';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllFarmsUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  private async applyQueryGetAll() {
    try {
      return await this.farmRepository.getAllFarms();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllFarmsUseCase.name,
        'Get All Farms'
      );
    }
  }

  async execute() {
    const farms = await this.applyQueryGetAll();

    if (farms) return farms;

    throw new Error('Does not exists Farms');
  }
}

export { GetAllFarmsUseCase };
