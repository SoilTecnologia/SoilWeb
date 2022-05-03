import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreatePumpController } from '../useCases/Pumps/CreatePump/CreatePumpController';
import { DeletePumpController } from '../useCases/Pumps/DeletePump/DeletePumpController';
import { GetPumpController } from '../useCases/Pumps/GetPump/GetPumpController';
import { UpdatePumpController } from '../useCases/Pumps/UpdatePump/UpdatePumpController';


const router = express.Router();

const createPumpController = new CreatePumpController();
const deletePumpController = new DeletePumpController();
const getPumpController = new GetPumpController();
const updatePumpController = new UpdatePumpController();

router.post('/addPump', authMiddleware(), createPumpController.handle);
router.delete('/deletePump/:id', authMiddleware(), deletePumpController.handle);
router.get('/getPump/:id', authMiddleware(),getPumpController.handle)
router.put('/updatePump',authMiddleware(),updatePumpController.handle)

export default router;
