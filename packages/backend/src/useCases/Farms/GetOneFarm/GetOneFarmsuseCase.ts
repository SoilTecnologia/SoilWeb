import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

class GetOneFarmUseCase {
  constructor(private farmRepository: IFarmsRepository) {}

  async execute(farm_id: string) {
    const newFarm = await this.farmRepository.getOneFarm(farm_id);

    if (newFarm) return newFarm;

    throw new Error('Não foi possivel buscar a fazenda');
  }
}

export { GetOneFarmUseCase };
