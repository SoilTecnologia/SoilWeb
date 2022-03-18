import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

class GetOneFarmUseCase {
  constructor(private farmRepository: IFarmsRepository) {}

  async execute(farm_id: string) {
    const newFarm = await this.farmRepository.findById(farm_id);

    return newFarm;
  }
}

export { GetOneFarmUseCase };
