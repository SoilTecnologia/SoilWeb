import express from 'express';
import authMiddleware from '../middlewares/auth';
import { GetPivotStateController } from '../useCases/States/GetPivotState/GetPivotStateController';

const router = express.Router();

const getPivotStateUseCase = new GetPivotStateController();

router.get(
  '/statePivot/:pivot_id',
  authMiddleware(),
  getPivotStateUseCase.handle
);

export default router;