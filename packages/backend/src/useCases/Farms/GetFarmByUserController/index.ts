import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { GetFarmByUserUseCase } from './GetFarmByUserUseCase';
import { GetFarmsByUserController } from './GetFarmsByUserController';

const farmRepository = new FarmsRepository();
const getFarmByUserUseCase = new GetFarmByUserUseCase(farmRepository);
const getFarmsByuserController = new GetFarmsByUserController(
  getFarmByUserUseCase
);

export { getFarmsByuserController };
