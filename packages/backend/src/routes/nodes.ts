import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { Pivot } from '@prisma/client';
import { createPivotController } from '../controllers/pivots';
import { readAllNodeController } from '../controllers/nodes';

const router = express.Router();

router.get(
  '/readAll/:farm_id',
  authMiddleware(['USER', 'SUDO']),
  async (req, res, next) => {
    const { farm_id } = req.params;

    try {
      const allNodesFromFarm = await readAllNodeController(farm_id);

      res.json(allNodesFromFarm);
    } catch (err) {
      console.log(`Server 500: ${err}`);
      next(err);
    }
  }
);

router.put(
  '/addPivot/:node_id',
  authMiddleware(['USER', 'SUDO']),
  async (req, res, next) => {
    const { node_id } = req.params;
    const {
      pivot_name,
      radio_id,
      pivot_lng,
      pivot_lat,
      pivot_start_angle,
      pivot_end_angle,
      pivot_radius
    } = req.body;

    try {
      const newPivot = await createPivotController(
        node_id,
        radio_id,
        pivot_name,
        pivot_lng,
        pivot_lat,
        pivot_start_angle,
        pivot_end_angle,
        pivot_radius,
      );

      res.send(newPivot);
    } catch (err) {
      console.log(`Server 500: ${err}`);
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
