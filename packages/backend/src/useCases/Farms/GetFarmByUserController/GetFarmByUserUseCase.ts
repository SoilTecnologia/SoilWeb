import { UserModel } from '../../../database/model/User';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';

class GetFarmByUserUseCase {
  constructor(private farmRepository: IFarmsRepository) {}

  async execute(user_id: UserModel['password']) {
    const farmsExists = await this.farmRepository.getFarmsByUser(user_id);

    if (farmsExists && farmsExists?.length > 0) return farmsExists;

    throw new Error('Does not exists Farms from user');
  }
}

export { GetFarmByUserUseCase };
