import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingController } from '../useCases/Scheduling/CreateScheduling/CreateSchedulingController'
import { DeleteSchedulingController } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingController';
import { UpdateSchedulingController } from '../useCases/Scheduling/UpdateScheduling/UpdateSchedulingController';

const router = express.Router();

const createSchedulingController = new CreateSchedulingController();
const deleteSchedulingController = new DeleteSchedulingController();
const updateSchedulingController = new UpdateSchedulingController();

router.post('/addScheduling', authMiddleware(), createSchedulingController.handle);
router.delete('/deleteScheduling/:id', authMiddleware(), deleteSchedulingController.handle)
router.put('/updateScheduling/', authMiddleware(), updateSchedulingController.handle)

export default router;