import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { Pivot } from '@prisma/client';
import { createPivotController } from '../controllers/pivots';

const router = express.Router();

router.put(
  '/addPivot/:node_id',
  authMiddleware(['USER', 'SUDO']),
  async (req, res, next) => {
    const {node_id} = req.params;
    const {pivot_id, pivot_name, pivot_lng, pivot_lat, pivot_start_angle, pivot_end_angle, pivot_radius, radio_id} = req.body;

    try {
      const newPivot = await createPivotController(pivot_id, node_id, pivot_name, pivot_lng, pivot_lat, pivot_start_angle, pivot_end_angle, pivot_radius, radio_id);

      res.send(newPivot);
    } catch (err) {
      next(err);
    }
  }
);

// router.delete(
//   '/:node_id',
//   authMiddleware(['SUDO']),
//   async(req, res, next) => {
//     const node_id = req.params.node_id;

//     try {
//       const deletedNode = await deleteNodeController(node_id);

//       res.send(deletedNode);
//     } catch(err) {
//       next(err);
//     }
//   }
// )

export default router;
