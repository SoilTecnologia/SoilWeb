import { inject, injectable } from 'tsyringe';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class GetOneFarmUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute(farm_id: string) {
    const newFarm = await this.farmRepository.findById(farm_id);

    return newFarm;
  }
}

export { GetOneFarmUseCase };
