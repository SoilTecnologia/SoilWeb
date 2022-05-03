import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreatePumpController } from '../useCases/Pumps/CreatePump/CreatePumpController';
import { DeletePumpController } from '../useCases/Pumps/DeletePump/DeletePumpController';


const router = express.Router();

const createPumpController = new CreatePumpController();
const deletePumpController = new DeletePumpController()

router.post('/addPump', authMiddleware(), createPumpController.handle);
router.delete('/deletePump/:id', authMiddleware(), deletePumpController.handle);

export default router;
