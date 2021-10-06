import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { Pivot } from '@prisma/client';
import { createNodeController, deleteNodeController } from '../controllers/node';
import { createPivotController } from '../controllers/pivot';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(['USER', 'SUDO']),
  async (req, res, next) => {
    const { node_id, farm_id, isGPRS } = req.body;

    try {
      const newNode = await createNodeController(node_id, farm_id, isGPRS);

      res.send(newNode);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/addPivot/:node_id',
  authMiddleware(['USER', 'SUDO']),
  async (req, res, next) => {
    const node_id = req.params.node_id;
    const {farm_id, pivot_name, lng, lat, start_angle, end_angle, radius} = req.body;

    try {
      const newPivot = await createPivotController(farm_id, node_id, pivot_name, lng, lat, start_angle, end_angle, radius);

      res.send(newPivot);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:node_id',
  authMiddleware(['SUDO']),
  async(req, res, next) => {
    const node_id = req.params.node_id;

    try {
      const deletedNode = await deleteNodeController(node_id);

      res.send(deletedNode);
    } catch(err) {
      next(err);
    }
  }
)

export default router;
