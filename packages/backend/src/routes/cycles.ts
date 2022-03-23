import express from 'express';
import authMiddleware from '../middlewares/auth';
import { GetCycleController } from '../useCases/Cycles/GetCycles/GetCycleController';
import { GetLastCycleController } from '../useCases/Cycles/GetLastCycles/GetLastCyclesController';

const router = express.Router();

const getLastCycleController = new GetLastCycleController();
const getCycleController = new GetCycleController();

router.get(
  '/cycles/:pivot_id/:start/:end',
  authMiddleware(),
  getCycleController.handle
);

router.get(
  '/cycles/:pivot_id',
  authMiddleware(),
  getLastCycleController.handle
);

export default router;
