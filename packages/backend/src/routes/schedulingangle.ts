import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateSchedulingAngleController } from '../useCases/SchedulingAngle/CreateSchedulingAngle/CreateSchedulingAngleController'
// import { DeleteSchedulingController } from '../useCases/Scheduling/DeleteScheduling/DeleteSchedulingController';
// import { UpdateSchedulingController } from '../useCases/Scheduling/UpdateScheduling/UpdateSchedulingController';
// import { GetSchedulingController } from '../useCases/Scheduling/GetScheduling/GetSchedulingController';
// import { GetAllSchedulingController } from '../useCases/Scheduling/GetAllScheduling/GetAllSchedulingController';

const router = express.Router();

const createSchedulingAngleController = new CreateSchedulingAngleController();
// const deleteSchedulingController = new DeleteSchedulingController();
// const updateSchedulingController = new UpdateSchedulingController();
// const getSchedulingController = new GetSchedulingController();
// const getAllSchedulingController = new GetAllSchedulingController();

router.post('/addSchedulingAngle', authMiddleware(), createSchedulingAngleController.handle);
// router.delete('/deleteScheduling/:id', authMiddleware(), deleteSchedulingController.handle)
// router.put('/updateScheduling/', authMiddleware(), updateSchedulingController.handle)
// router.get('/getScheduling/:id', authMiddleware(), getSchedulingController.handle)
// router.get('/getAllScheduling', authMiddleware(), getAllSchedulingController.handle)

export default router;