import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateNodeController } from '../useCases/Nodes/CreateNode/CreateNodeController';
import { DeleteNodeController } from '../useCases/Nodes/DeleteNode/DeleteNodeController';
import { GetAllByFarmIdController } from '../useCases/Nodes/GetAllByFarmId/GetAllByFarmIdController';
import { GetByNumByFarmController } from '../useCases/Nodes/GetByNumByFarm/GetByNumByFarmController';
import { UpdateNodeController } from '../useCases/Nodes/UpdateNode/UpdateNodeController';

const router = express.Router();

const createNodeController = new CreateNodeController();
const updateNodeController = new UpdateNodeController();
const deleteNodeController = new DeleteNodeController();
const getAllByFarmIdController = new GetAllByFarmIdController();
const getByNumByFarmController = new GetByNumByFarmController();

router.put('/updateNode', authMiddleware(), updateNodeController.handle);
router.post('/addNode', authMiddleware(), createNodeController.handle);
router.delete('/deleteNode/:id', authMiddleware(), deleteNodeController.handle);
router.get(
  '/nodeNum/:node_num/:farm_id',
  authMiddleware(),
  getByNumByFarmController.handle
);

router.get(
  '/readAll/:farm_id',
  authMiddleware(),
  getAllByFarmIdController.handle
);

export default router;
