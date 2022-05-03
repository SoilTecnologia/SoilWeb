import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreatePumpController } from '../useCases/Pumps/CreatePump/CreatePumpController';
import { DeletePumpController } from '../useCases/Pumps/DeletePump/DeletePumpController';
import { GetPumpController } from '../useCases/Pumps/GetPump/GetPumpController';


const router = express.Router();

const createPumpController = new CreatePumpController();
const deletePumpController = new DeletePumpController();
const getPumpController = new GetPumpController();

router.post('/addPump', authMiddleware(), createPumpController.handle);
router.delete('/deletePump/:id', authMiddleware(), deletePumpController.handle);
router.get('/getPump/:id', authMiddleware(),getPumpController.handle)

export default router;
