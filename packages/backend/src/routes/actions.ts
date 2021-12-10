import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { createActionController } from '../controllers/actions';
import { readOnePivotController } from '../controllers/pivots';

const router = express.Router();
router.post(
  '/create/:pivot_id',
  authMiddleware(['USER', 'SUDO']),
  authHandler(async (req, res, next) => {
    const { pivot_id } = req.params;
    const {
      power,
      water,
      direction,
      percentimeter
    } = req.body;

    try {
			const pivot = await readOnePivotController(pivot_id);
      const newAction = await createActionController(pivot_id, pivot!.radio_id, req.user.user_id, power, water, direction, percentimeter, new Date());

      res.json(newAction);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  })
);

export default router;