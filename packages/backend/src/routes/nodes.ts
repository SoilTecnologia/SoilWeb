import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { createPivotController } from '../controllers/pivots';
import {
  createNodeController,
  deleteNodeController,
  putNodeController,
  readAllNodeController
} from '../controllers/nodes';
import Node from '../models/node';

const router = express.Router();

router.get('/readAll/:farm_id', authMiddleware(), async (req, res, next) => {
  const { farm_id } = req.params;

  try {
    const allNodesFromFarm = await readAllNodeController(farm_id);

    res.json(allNodesFromFarm);
  } catch (err) {
    console.log(`[ERROR] Server 500 on /nodes/readAll`);
    console.log(err);
    next(err);
  }
});

router.put(
  '/updateNode',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const node: Node = req.body;

      try {
        const newNode = await putNodeController(node);

        res.send(newNode);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /nodes/addNode`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.post(
  '/addNode',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const node: Node = req.body;

      try {
        const newNode = await createNodeController(node);

        res.send(newNode);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /nodes/addNode`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.delete(
  '/deleteNode/:id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { id } = req.params;

      try {
        const newNode = await deleteNodeController(id);

        res.send(newNode);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /nodes/addNode`);
        console.log(err);
        next(err);
      }
    }
  )
);
export default router;
