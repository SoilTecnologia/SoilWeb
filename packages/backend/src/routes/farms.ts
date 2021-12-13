import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { readAllFarmController, readMapFarmControler } from '../controllers/farms';
import { createNodeController } from '../controllers/nodes';
import Farm from '../models/farm';
import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';

const router = express.Router();

router.put(
  '/addNode/:farm_id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { farm_id } = req.params;
      const { node_name, gateway, is_gprs } = req.body;

      try {
        const newNode = await createNodeController(
          farm_id,
          node_name,
          is_gprs,
          gateway
        );

        res.send(newNode);
      } catch (err) {
        console.log(`Server 500: ${err}`);
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
        console.log(`Server 500: ${err}`);
        next(err);
      }
    }
  )
);

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

router.get('/map/:farm_id', authMiddleware(), async (req, res, next) /*: Promise<PivotMapData>*/ => {
  const { farm_id } = req.params;

  try {
    const result = await readMapFarmControler(farm_id);

    res.json(result);
  } catch (err) {
    console.log(`Server 500: ${err}`);
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
//   '/addUser/:target_farm_id',
//   authMiddleware(['USER', 'SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;
//       const { target_farm_id } = req.params;
//       const { target_user_id, farm_user_type } = req.body;

//       try {
//         const farms = await addUserToFarmController(
//           user.user_id,
//           target_user_id,
//           target_farm_id,
//           farm_user_type
//         );

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

// router.delete('/:farm_id', authMiddleware(['SUDO']), async (req, res, next) => {
//   const farm_id = req.params.farm_id;

//   try {
//     const deletedFarm = await deleteFarmController(farm_id);

//     res.send(deletedFarm);
//   } catch (err) {
//     next(err);
//   }
// });

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
