import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { CreateFarmController } from './CreateFarmController';
import { CreateFarmUseCase } from './CreateFarmUseCase';

const farmRepository = new FarmsRepository();
const createFarmUseCase = new CreateFarmUseCase(farmRepository);
const createFarmController = new CreateFarmController(createFarmUseCase);

export { createFarmController };
