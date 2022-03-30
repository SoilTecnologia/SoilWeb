import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingController } from '../useCases/Scheduling/CreateScheduling/CreateSchedulingController'
import { DeleteSchedulingController } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingController';

const router = express.Router();

const createSchedulingController = new CreateSchedulingController();
const deleteSchedulingController = new DeleteSchedulingController();

router.post('/addScheduling', authMiddleware(), createSchedulingController.handle);
router.delete('/deleteScheduling/:id', authMiddleware(), deleteSchedulingController.handle)

export default router;