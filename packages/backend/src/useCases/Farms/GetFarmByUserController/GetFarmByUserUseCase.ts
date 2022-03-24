import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

@injectable()
class GetFarmByUserUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute(user_id: UserModel['password']) {
    const farmsExists = await this.farmRepository.getFarmsByUser(user_id);

    return farmsExists;
  }
}

export { GetFarmByUserUseCase };
