import express from 'express';
import authMiddleware from "../protocols/middlewares/auth"
import { CreatePumpController } from '../useCases/Pumps/CreatePump/CreatePumpController';
import { DeletePumpController } from '../useCases/Pumps/DeletePump/DeletePumpController';
import { GetPumpController } from '../useCases/Pumps/GetPump/GetPumpController';
import { UpdatePumpController } from '../useCases/Pumps/UpdatePump/UpdatePumpController';
import { GetAllPumpController } from '../useCases/Pumps/GetAllPump/GetAllPumpController';


const router = express.Router();

const createPumpController = new CreatePumpController();
const deletePumpController = new DeletePumpController();
const getPumpController = new GetPumpController();
const updatePumpController = new UpdatePumpController();
const getAllPumpController = new GetAllPumpController();

router.post('/addPump', authMiddleware(), createPumpController.handle);
router.delete('/deletePump/:id', authMiddleware(), deletePumpController.handle);
router.get('/getPump/:id', authMiddleware(),getPumpController.handle)
router.put('/updatePump',authMiddleware(),updatePumpController.handle)
router.get('/getAllPump',authMiddleware(),getAllPumpController.handle)

export default router;
