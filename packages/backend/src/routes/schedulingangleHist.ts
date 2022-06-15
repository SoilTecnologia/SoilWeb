import express from 'express';
import authMiddleware from "../protocols/middlewares/auth"
import { CreateSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/CreateSchedulingAngleHist/CreateSchedulingAngleHistController'
import { DeleteSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/DeleteSchedulingAngleHist/DeleteSchedulingAngleHistController';
import { GetAllSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/GetAllSchedulingAngleHist/GetAllSchedulingAngleHistController';
import { GetSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/GetSchedulingAngleHist/GetSchedulingAngleHistController';
import { UpdateSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/UpdateSchedulingAngleHist/UpdateSchedulingAngleHistController';
import { GetUserSchedulingAngleHistController } from '../useCases/SchedulingAngleHist/GetUserSchedulingAngleHist/GetUserSchedulingHistController';

const router = express.Router();

const createSchedulingAngleHistController = new CreateSchedulingAngleHistController();
const deleteSchedulingAngleHistController = new DeleteSchedulingAngleHistController();
const updateSchedulingAngleHistController = new UpdateSchedulingAngleHistController();
const getSchedulingAngleHistController = new GetSchedulingAngleHistController();
const getAllSchedulingAngleHistController = new GetAllSchedulingAngleHistController();
const getUserSchedlingAngleHistController = new GetUserSchedulingAngleHistController();

router.post('/addSchedulingAngleHist', authMiddleware(), createSchedulingAngleHistController.handle);
router.delete('/deleteSchedulingAngleHist/:id', authMiddleware(), deleteSchedulingAngleHistController.handle)
router.put('/updateSchedulingAngleHist/', authMiddleware(), updateSchedulingAngleHistController.handle)
router.get('/getSchedulingAngleHist/:id', authMiddleware(), getSchedulingAngleHistController.handle)
router.get('/getAllSchedulingAngleHist', authMiddleware(), getAllSchedulingAngleHistController.handle)
router.get('/getUserSchedulingAngleHist/:id', authMiddleware(), getUserSchedlingAngleHistController.handle)

export default router;