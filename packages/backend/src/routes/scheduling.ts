import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { CreateSchedulingController } from '../useCases/data/Scheduling/CreateScheduling/CreateSchedulingController';
import { DeleteSchedulingController } from '../useCases/data/Scheduling/DeleteScheduling/DeleteSchedulingController';
import { UpdateSchedulingController } from '../useCases/data/Scheduling/UpdateScheduling/UpdateSchedulingController';
import { GetSchedulingController } from '../useCases/data/Scheduling/GetScheduling/GetSchedulingController';
import { GetAllSchedulingController } from '../useCases/data/Scheduling/GetAllScheduling/GetAllSchedulingController';

const router = express.Router();

const createSchedulingController = new CreateSchedulingController();
const deleteSchedulingController = new DeleteSchedulingController();
const updateSchedulingController = new UpdateSchedulingController();
const getSchedulingController = new GetSchedulingController();
const getAllSchedulingController = new GetAllSchedulingController();

router.post(
  '/addScheduling',
  authMiddleware(),
  createSchedulingController.handle
);
router.delete(
  '/deleteScheduling/:id',
  authMiddleware(),
  deleteSchedulingController.handle
);

router.put(
  '/updateScheduling',
  authMiddleware(),
  updateSchedulingController.handle
);
router.get(
  '/getScheduling/:id',
  authMiddleware(),
  getSchedulingController.handle
);
router.get(
  '/getAllScheduling',
  authMiddleware(),
  getAllSchedulingController.handle
);

export default router;
