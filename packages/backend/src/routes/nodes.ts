import express from 'express';
import {
  readAllNodeController,
  readWithNodeNumController
} from '../controllers/nodes';
import authMiddleware from '../middlewares/auth';
import { CreateNodeController } from '../useCases/Nodes/CreateNode/CreateNodeController';
import { DeleteNodeController } from '../useCases/Nodes/DeleteNode/DeleteNodeController';
import { UpdateNodeController } from '../useCases/Nodes/UpdateNode/UpdateNodeController';

const router = express.Router();

const createNodeController = new CreateNodeController();
const updateNodeController = new UpdateNodeController();
const deleteNodeController = new DeleteNodeController();

router.get(
  '/nodeNum/:node_num/:farm_id',
  authMiddleware(),
  async (req, res, next) => {
    const { farm_id, node_num } = req.params;

    try {
      const allNodesFromFarm = await readWithNodeNumController(
        farm_id,
        Number(node_num)
      );

      res.send(allNodesFromFarm);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /nodes/readAll`);
      console.log(err);
      next(err);
    }
  }
);

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

router.put('/updateNode', authMiddleware(), updateNodeController.handle);
router.post('/addNode', authMiddleware(), createNodeController.handle);
router.delete('/deleteNode/:id', authMiddleware(), deleteNodeController.handle);

export default router;
