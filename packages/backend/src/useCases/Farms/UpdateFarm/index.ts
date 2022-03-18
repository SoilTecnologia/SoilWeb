import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { UpdateFarmController } from './UpdateFarmsController';
import { UpdateFarmUseCase } from './UpdateFarmUseCase';

const farmRepository = new FarmsRepository();
const updateFarmUseCase = new UpdateFarmUseCase(farmRepository);
const updateFarmController = new UpdateFarmController(updateFarmUseCase);

export { updateFarmController };
