import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { DeleteFarmController } from './DeleteFarmController';
import { DeleteFarmUseCase } from './DeleteFarmUseCase';

const farmRepository = new FarmsRepository();
const deleteFarmUseCase = new DeleteFarmUseCase(farmRepository);
const deleteFarmController = new DeleteFarmController(deleteFarmUseCase);

export { deleteFarmController };
