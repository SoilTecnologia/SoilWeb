/* eslint-disable spaced-comment */
import express from 'express';
import {
  deleteFarmController,
  getAllFarmUser,
  getOneFarmController,
  readAllFarmController,
  readMapFarmControler
} from '../controllers/farms';
import authMiddleware from '../middlewares/auth';
import Farm from '../models/farm';
import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';
import { authHandler, IUserAuthInfoRequest } from '../types/express';
import { createFarmController } from '../useCases/Farms/CreateFarms';
import { updateFarmController } from '../useCases/Farms/UpdateFarm';

type PivotMapData = {
  pivot_position: { lng: Pivot['pivot_lng']; lat: Pivot['pivot_lat'] };
  power: State['power'];
  water: State['water'];
  direction: State['direction'];
  angle: StateVariable['angle'];
  start_angle: Pivot['pivot_start_angle'];
  end_angle: Pivot['pivot_end_angle'];
};

type FullMapData = {
  farm_position: { lng: Farm['farm_lng']; lat: Farm['farm_lat'] };
  pivots: Array<PivotMapData>;
};

const router = express.Router();

router.post(
  '/addFarm',
  authMiddleware(),
  async (req, res, next) => await createFarmController.handle(req, res, next)
);

router.get(
  '/farmUser/:id',
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { id } = req.params;

      try {
        const allFarmsFromUser = await getAllFarmUser(id);

        res.send(allFarmsFromUser);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /farms/readAll`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.get(
  '/readAll',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { user_id } = req.user;

      try {
        const allFarmsFromUser = await readAllFarmController(user_id);

        res.send(allFarmsFromUser);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /farms/readAll`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.get(
  '/map/:farm_id',
  authMiddleware(),
  async (req, res, next) /*: Promise<PivotMapData>*/ => {
    const { farm_id } = req.params;

    try {
      const result = await readMapFarmControler(farm_id);

      res.json(result);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/map`);
      console.log(err);
      next(err);
    }
  }
);

router.put(
  '/updateFarm',
  authMiddleware(),
  async (req, res, next) => await updateFarmController.handle(req, res, next)
);

router.delete('/deleteFarm/:id', authMiddleware(), async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedFarm = await deleteFarmController(id);

    res.send(deletedFarm);
  } catch (err) {
    console.log('[ERROR] 500 Internal server error');
    console.log(err);
    next(err);
  }
});
router.get(
  '/getOneFarm/:farmId',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { farmId } = req.params;

      try {
        const allFarmsFromUser = await getOneFarmController(farmId);

        res.send(allFarmsFromUser);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /farms/readAll`);
        console.log(err);
        next(err);
      }
    }
  )
);

export default router;
