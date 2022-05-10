import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingHistoryController } from '../useCases/SchedulingHistory/CreateSchedulingHistory/CreateSchedulingHistoryController';
import { DeleteSchedulingHistoryController } from '../useCases/SchedulingHistory/DeleteSchedulingHistory/DeleteSchedulingHistoryController';
import { GetAllSchedulingHistoryController } from '../useCases/SchedulingHistory/GetAllSchedulingHistory/GetAllSchedulingHistoryController';
import { GetPivotSchedulingHistoryController } from '../useCases/SchedulingHistory/GetPivotSchedulingHistory/GetPivotSchedulingHistoryController';
//import { UpdateSchedulingController } from '../useCases/Scheduling/UpdateScheduling/UpdateSchedulingController';

const router = express.Router();

const createSchedulingHistoryController = new CreateSchedulingHistoryController();
const deleteSchedulingHistoryController = new DeleteSchedulingHistoryController();
const getAllSchedulingHistoryController = new GetAllSchedulingHistoryController();
const getPivotSchedulingHistoryController = new GetPivotSchedulingHistoryController();
//const updateSchedulingController = new UpdateSchedulingController();
  
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
// router.put(
//   '/updateScheduling/',
//   authMiddleware(),
//   updateSchedulingController.handle
// );
router.get(
  '/getScheduling/:id',
  authMiddleware(),
  getPivotSchedulingHistoryController.handle
);
router.get(
  '/getAllSchedulingHistory',
  authMiddleware(),
  getAllSchedulingHistoryController.handle
);

export default router;
