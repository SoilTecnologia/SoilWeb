import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { GetMapFarmsController } from './GetMapController';
import { GetMapFarmUseCase } from './GetMapFarmsuseCase';

const farmRepository = new FarmsRepository();
const getMapFarmsUseCase = new GetMapFarmUseCase(farmRepository);
const getMapFarmsController = new GetMapFarmsController(getMapFarmsUseCase);

export { getMapFarmsController };
