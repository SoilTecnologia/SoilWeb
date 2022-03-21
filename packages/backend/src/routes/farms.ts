/* eslint-disable spaced-comment */
import express from 'express';
import authMiddleware from '../middlewares/auth';
import { authHandler } from '../types/express';
import { createFarmController } from '../useCases/Farms/CreateFarms';
import { deleteFarmController } from '../useCases/Farms/DeleteFarm';
import { getAllFarmsController } from '../useCases/Farms/GetAllfarms';
import { getFarmsByuserController } from '../useCases/Farms/GetFarmByUserController';
import { getMapFarmsController } from '../useCases/Farms/GetMapFarms';
import { getOneFarmController } from '../useCases/Farms/GetOneFarm';
import { updateFarmController } from '../useCases/Farms/UpdateFarm';

const router = express.Router();

router.post(
  '/addFarm',
  authMiddleware(),
  async (req, res, next) => await createFarmController.handle(req, res, next)
);

router.get(
  '/farmUser/:id',
  authHandler(
    async (req, res, next) =>
      await getFarmsByuserController.handle(req, res, next)
  )
);

router.get(
  '/readAll',
  authMiddleware(),
  authHandler(
    async (req, res, next) => await getAllFarmsController.handle(req, res, next)
  )
);

router.get(
  '/map/:farm_id',
  authMiddleware(),
  async (req, res, next) => await getMapFarmsController.handle(req, res, next)
);

router.put(
  '/updateFarm',
  authMiddleware(),
  async (req, res, next) => await updateFarmController.handle(req, res, next)
);

router.delete(
  '/deleteFarm/:id',
  authMiddleware(),
  async (req, res, next) => await deleteFarmController.handle(req, res, next)
);

router.get(
  '/getOneFarm/:farmId',
  authMiddleware(),
  authHandler(
    async (req, res, next) => await getOneFarmController.handle(req, res, next)
  )
);

export default router;
