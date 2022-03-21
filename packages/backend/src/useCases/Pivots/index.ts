import { PivotsRepository } from '../../database/repositories/Pivots/PivotsRepository';
import { CreatePivotController } from './CreatePivotController';
import { CreatePivotUseCase } from './CreatePivotUseCase';

const pivotRepository = new PivotsRepository();
const createPivotUseCase = new CreatePivotUseCase(pivotRepository);
const createPivotController = new CreatePivotController(createPivotUseCase);

export { createPivotController };
