import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { CreateSchedulingHistoryController } from '../useCases/data/SchedulingHistory/CreateSchedulingHistory/CreateSchedulingHistoryController';
import { DeleteSchedulingHistoryController } from '../useCases/data/SchedulingHistory/DeleteSchedulingHistory/DeleteSchedulingHistoryController';
import { GetAllSchedulingHistoryController } from '../useCases/data/SchedulingHistory/GetAllSchedulingHistory/GetAllSchedulingHistoryController';
import { GetPivotSchedulingHistoryController } from '../useCases/data/SchedulingHistory/GetPivotSchedulingHistory/GetPivotSchedulingHistoryController';
import { GetUserSchedulingHistoryController } from '../useCases/data/SchedulingHistory/GetUserSchedulingHistory/GetUserSchedulingHistoryController';
import { UpdateSchedulingHistoryController } from '../useCases/data/SchedulingHistory/UpdateSchedulingHistory/UpdateSchedulingHistoryController';

const router = express.Router();

const createSchedulingHistoryController =
  new CreateSchedulingHistoryController();
const deleteSchedulingHistoryController =
  new DeleteSchedulingHistoryController();
const getAllSchedulingHistoryController =
  new GetAllSchedulingHistoryController();
const getPivotSchedulingHistoryController =
  new GetPivotSchedulingHistoryController();
const getUserSchedulingHistoryController =
  new GetUserSchedulingHistoryController();
const updateSchedulingHistoryController =
  new UpdateSchedulingHistoryController();

router.post(
  '/addSchedulingHistory',
  authMiddleware(),
  createSchedulingHistoryController.handle
);
router.delete(
  '/deleteSchedulingHistory/:id',
  authMiddleware(),
  deleteSchedulingHistoryController.handle
);
router.put(
  '/updateSchedulingHistory/',
  authMiddleware(),
  updateSchedulingHistoryController.handle
);
router.get(
  '/getSchedulingPivotHistory/:id',
  authMiddleware(),
  getPivotSchedulingHistoryController.handle
);
router.get(
  '/getUserSchedulingHistory/:id',
  authMiddleware(),
  getUserSchedulingHistoryController.handle
);
router.get(
  '/getAllSchedulingHistory',
  authMiddleware(),
  getAllSchedulingHistoryController.handle
);

export default router;
