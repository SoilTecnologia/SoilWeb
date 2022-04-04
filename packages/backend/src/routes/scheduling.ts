import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingController } from '../useCases/Scheduling/CreateScheduling/CreateSchedulingController'
import { DeleteSchedulingController } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingController';
import { UpdateSchedulingController } from '../useCases/Scheduling/UpdateScheduling/UpdateSchedulingController';
import { GetSchedulingController } from '../useCases/Scheduling/GetScheduling/GetSchedulingController';

const router = express.Router();

const createSchedulingController = new CreateSchedulingController();
const deleteSchedulingController = new DeleteSchedulingController();
const updateSchedulingController = new UpdateSchedulingController();
const getSchedulingController = new GetSchedulingController();

router.post('/addScheduling', authMiddleware(), createSchedulingController.handle);
router.delete('/deleteScheduling/:id', authMiddleware(), deleteSchedulingController.handle)
router.put('/updateScheduling/', authMiddleware(), updateSchedulingController.handle)
router.get('/getScheduling/:id', authMiddleware(), getSchedulingController.handle)

export default router;