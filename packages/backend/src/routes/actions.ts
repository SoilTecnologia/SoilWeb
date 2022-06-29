import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateActionController } from '../useCases/Actions/CreateAction/CreateActionController';
import { DeleteActionController } from '../useCases/Actions/DeleteAction/DeleteActionController';
import { DeleteAllActionController } from '../useCases/Actions/DeleteAllActions/DeleteALlActionController';
import { GetAllActionsController } from '../useCases/Actions/GetAllActions/GetAllActionsController';
import { ReadStateController } from '../useCases/Actions/ReadState/ReadStateController';

const router = express.Router();

const getAllActionController = new GetAllActionsController();
const createActionController = new CreateActionController();
const deleteActionController = new DeleteActionController();
const deleteAllActionController = new DeleteAllActionController();
const readStateController = new ReadStateController();

router.post(
  '/create/:pivot_id',
  authMiddleware(),
  createActionController.handle
);

router.get('/read', authMiddleware(), getAllActionController.handle);
router.delete(
  '/del/:action_id',
  authMiddleware(),
  deleteActionController.handle
);
router.delete(
  '/delAll/:user_id',
  authMiddleware(),
  deleteAllActionController.handle
);
router.post('/readState', authMiddleware(), readStateController.handle);

export default router;
