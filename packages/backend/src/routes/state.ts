import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { GetPivotStateController } from '../useCases/data/States/GetPivotState/GetPivotStateController';

const router = express.Router();

const getPivotStateUseCase = new GetPivotStateController();

router.get(
  '/statePivot/:pivot_id',
  authMiddleware(),
  getPivotStateUseCase.handle
);

export default router;
