import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

class GetAllFarmsUseCase {
  constructor(private farmRepository: IFarmsRepository) {}

  async execute() {
    const farms = await this.farmRepository.getAllFarms();

    if (farms && farms.length > 0) return farms;

    throw new Error('Does not exists Farms');
  }
}

export { GetAllFarmsUseCase };
