import { inject, injectable } from 'tsyringe';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class GetAllFarmsUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute() {
    const farms = await this.farmRepository.getAllFarms();

    if (farms && farms.length > 0) return farms;

    throw new Error('Does not exists Farms');
  }
}

export { GetAllFarmsUseCase };
