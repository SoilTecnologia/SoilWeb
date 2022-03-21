import express from 'express';
import {
  getCyclesFromPivot,
  getLastCycleFromPivot
} from '../controllers/cycles';
import authMiddleware from '../middlewares/auth';
import { authHandler } from '../types/express';

const router = express.Router();

router.get(
  '/cycles/:pivot_id/:start/:end',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id, start, end } = req.params;

    try {
      const pivotList = await getCyclesFromPivot(pivot_id, start, end);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles/start/end`);
      console.log(err);
      next(err);
    }
  })
);

router.get(
  '/cycles/:pivot_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id } = req.params;

    try {
      const pivotList = await getLastCycleFromPivot(pivot_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles`);
      console.log(err);
      next(err);
    }
  })
);

export default router;
