/* eslint-disable spaced-comment */
import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { CreateFarmController } from '@useCases/data/Farms/CreateFarms/CreateFarmController';
import { DeleteFarmController } from '@useCases/data/Farms/DeleteFarm/DeleteFarmController';
import { GetAllFarmsController } from '@useCases/data/Farms/GetAllfarms/GetAllFarmsController';
import { GetFarmsByUserController } from '@useCases/data/Farms/GetFarmByUserController/GetFarmsByUserController';
import { GetOneFarmController } from '@useCases/data/Farms/GetOneFarm/GetOneFarmController';
import { UpdateFarmController } from '@useCases/data/Farms/UpdateFarm/UpdateFarmsController';

const router = express.Router();

const createFarmController = new CreateFarmController();
const deleteFarmController = new DeleteFarmController();
const getAllFarmsController = new GetAllFarmsController();
const getFarmsByuserController = new GetFarmsByUserController();
const getOneFarmController = new GetOneFarmController();
const updateFarmController = new UpdateFarmController();

router.post('/addFarm', authMiddleware(), createFarmController.handle);
router.get('/farmUser/:id', authMiddleware(), getFarmsByuserController.handle);
router.get('/readAll', authMiddleware(), getAllFarmsController.handle);
router.put('/updateFarm', authMiddleware(), updateFarmController.handle);
router.delete('/deleteFarm/:id', authMiddleware(), deleteFarmController.handle);
router.get(
  '/getOneFarm/:farmId',
  authMiddleware(),
  getOneFarmController.handle
);

export default router;
