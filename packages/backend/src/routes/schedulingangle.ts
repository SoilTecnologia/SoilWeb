import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingAngleController } from '../useCases/SchedulingAngle/CreateSchedulingAngle/CreateSchedulingAngleController'
import { DeleteSchedulingAngleController } from '../useCases/SchedulingAngle/DeleteSchedulingAngle/DeleteSchedulingAngleController';
import { GetAllSchedulingAngleController } from '../useCases/SchedulingAngle/GetAllSchedulingAngle/GetAllSchedulingAngleController';
import { GetSchedulingAngleController } from '../useCases/SchedulingAngle/GetSchedulingAngle/GetSchedulingAngleController';
import { UpdateSchedulingAngleController } from '../useCases/SchedulingAngle/UpdateSchedulingAngle/UpdateSchedulingAngleController';

const router = express.Router();

const createSchedulingAngleController = new CreateSchedulingAngleController();
const deleteSchedulingAngleController = new DeleteSchedulingAngleController();
const updateSchedulingAngleController = new UpdateSchedulingAngleController();
const getSchedulingAngleController = new GetSchedulingAngleController();
const getAllSchedulingAngleController = new GetAllSchedulingAngleController();

router.post('/addSchedulingAngle', authMiddleware(), createSchedulingAngleController.handle);
router.delete('/deleteSchedulingAngle/:id', authMiddleware(), deleteSchedulingAngleController.handle)
router.put('/updateSchedulingAngle/', authMiddleware(), updateSchedulingAngleController.handle)
router.get('/getSchedulingAngle/:id', authMiddleware(), getSchedulingAngleController.handle)
router.get('/getAllSchedulingAngle', authMiddleware(), getAllSchedulingAngleController.handle)

export default router;