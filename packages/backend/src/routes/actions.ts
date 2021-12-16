import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import {
  createActionController,
  readAllActionsController
} from '../controllers/actions';
import { readOnePivotController } from '../controllers/pivots';

const router = express.Router();
router.post(
  '/create/:pivot_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id } = req.params;
    const { power, water, direction, percentimeter } = req.body;

    try {
      const pivot = await readOnePivotController(pivot_id);
      const newAction = await createActionController(
        pivot_id,
        req.user.user_id,
        power,
        water,
        direction,
        percentimeter,
        new Date()
      );

      res.json(newAction);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /actions/create`);
      console.log(err);
      next(err);
    }
  })
);

router.get('/read', async (req, res, next) => {
  try {
    const actions = await readAllActionsController();

    res.json(actions);
  } catch (err) {
    console.log(`[ERROR] Server 500 on /actions/read`);
    console.log(err);
    next(err);
  }
});

export default router;
