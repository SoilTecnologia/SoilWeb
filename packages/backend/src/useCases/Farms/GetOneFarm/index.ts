import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { GetOneFarmController } from './GetOneFarmController';
import { GetOneFarmUseCase } from './GetOneFarmsuseCase';

const farmRepository = new FarmsRepository();
const getOneFarmUseCase = new GetOneFarmUseCase(farmRepository);
const getOneFarmController = new GetOneFarmController(getOneFarmUseCase);

export { getOneFarmController };
