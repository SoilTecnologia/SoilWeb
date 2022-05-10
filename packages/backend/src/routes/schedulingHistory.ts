import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingHistoryController } from '../useCases/SchedulingHistory/CreateSchedulingHistory/CreateSchedulingHistoryController';
import { DeleteSchedulingHistoryController } from '../useCases/SchedulingHistory/DeleteSchedulingHistory/DeleteSchedulingHistoryController';
//import { UpdateSchedulingController } from '../useCases/Scheduling/UpdateScheduling/UpdateSchedulingController';
//import { GetSchedulingController } from '../useCases/Scheduling/GetScheduling/GetSchedulingController';
//import { GetAllSchedulingController } from '../useCases/Scheduling/GetAllScheduling/GetAllSchedulingController';

const router = express.Router();

const createSchedulingHistoryController = new CreateSchedulingHistoryController();
const deleteSchedulingHistoryController = new DeleteSchedulingHistoryController();
//const updateSchedulingController = new UpdateSchedulingController();
//const getSchedulingController = new GetSchedulingController();
//const getAllSchedulingController = new GetAllSchedulingController();
  
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
// router.get(
//   '/getScheduling/:id',
//   authMiddleware(),
//   getSchedulingController.handle
// );
// router.get(
//   '/getAllScheduling',
//   authMiddleware(),
//   getAllSchedulingController.handle
// );

export default router;
