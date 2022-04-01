import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { ERROR_QUERIES_DATABASE } from '../../../utils/types';

@injectable()
class GetFarmByUserUseCase {
  constructor(
    @inject('FarmsRepository') private farmRepository: IFarmsRepository
  ) {}

  async execute(user_id: UserModel['password']) {
    try {
      return await this.farmRepository.getFarmsByUser(user_id);
    } catch (err) {
      console.log(`${ERROR_QUERIES_DATABASE} --> ${GetFarmByUserUseCase.name}`);
      console.log(err.message);
    }
  }
}

export { GetFarmByUserUseCase };
