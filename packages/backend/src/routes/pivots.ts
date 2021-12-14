import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import {
  readAllPivotController,
  updatePivotController,
  readListPivotController,
  // readMapPivotController
} from '../controllers/pivots';
import { getLastCycleFromPivot } from '../controllers/cycles';

const router = express.Router();

router.get(
  '/readAll/:farm_id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { farm_id } = req.params;

      try {
        const allPivotsFromNode = await readAllPivotController(farm_id);

        res.send(allPivotsFromNode);
      } catch (err) {
        console.log(`Server 500: ${err}`);
        next(err);
      }
    }
  )
);

// router.get(
//   '/map/:farm_id',
//   authMiddleware(),
//   authHandler(async (req, res, next) => {
//     const {farm_id} = req.params;
//     const {user_id} = req.user;

//     try {
//       const pivotList = await readMapPivotController(user_id, farm_id);
//       res.json(pivotList);
//     } catch (err) {
//       console.log(`Server 500: ${err}`);
//       next(err);
//     }
//   })
// );

router.get(
  '/cycles/:pivot_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const {pivot_id} = req.params;

    try {
      const pivotList = await getLastCycleFromPivot(pivot_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  })
);

router.get(
  '/list/:farm_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const {farm_id} = req.params;
    const {user_id} = req.user;

    try {
      const pivotList = await readListPivotController(user_id, farm_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  })
);

router.post(
  '/update/:pivot_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id } = req.params;
    const {
      connection,
      power,
      water,
      direction,
      angle,
      percentimeter,
      timestamp
    } = req.body;
    const { father, rssi } = req.body;

    try {
      const updatedPivot = await updatePivotController(
        pivot_id,
        connection,
        power,
        water,
        direction,
        angle,
        percentimeter,
        timestamp,
        father,
        rssi
      );

      res.json(updatedPivot);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  })
);

export default router;
