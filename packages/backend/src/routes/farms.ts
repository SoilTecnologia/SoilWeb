/* eslint-disable spaced-comment */
import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import {
  createFarmController,
  deleteFarmController,
  getAllFarmUser,
  putFarmController,
  readAllFarmController,
  readMapFarmControler
} from '../controllers/farms';
import { createNodeController } from '../controllers/nodes';
import Farm from '../models/farm';
import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';

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
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { user_id, farm_name, farm_city, farm_lng, farm_lat } = req.body;
      try {
        const farm = await createFarmController(
          user_id,
          farm_name,
          farm_city,
          farm_lng,
          farm_lat
        );
        res.send(farm);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /users/addFarm!`);
        console.log(err);
        next(err);
      }
    }
  )
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
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const farm = req.body;
      try {
        const putFarm = await putFarmController(farm);

        res.send(putFarm);
      } catch (err) {
        console.log('[ERROR] Internal Server error');
        console.log(err);
        next(err);
      }
    }
  )
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

// router.get(
//   '/readAll',
//   authMiddleware(['SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;

//       try {
//         const farms = await readAllFarmController(user.user_id);

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

// router.put(
//   '/addAdmin/:target_farm_id',
//   authMiddleware(['SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;
//       const { target_farm_id } = req.params;
//       const { target_user_id } = req.body;

//       try {
//         const farms = await addUserToFarmController(
//           user.user_id,
//           target_user_id,
//           target_farm_id
//         );

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

export default router;
