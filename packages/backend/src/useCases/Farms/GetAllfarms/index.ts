import { FarmsRepository } from '../../../database/repositories/Farms/FarmsRepository';
import { GetAllFarmsController } from './GetAllFarmsController';
import { GetAllFarmsUseCase } from './GetAllFarmsUseCase';

const farmRepository = new FarmsRepository();
const getAllFarmsUseCase = new GetAllFarmsUseCase(farmRepository);
const getAllFarmsController = new GetAllFarmsController(getAllFarmsUseCase);

export { getAllFarmsController };
