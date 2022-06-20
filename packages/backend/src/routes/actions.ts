import express from 'express';
import authMiddleware from '../protocols/middlewares/auth';
import { CreateActionController } from '../useCases/data/Actions/CreateAction/CreateActionController';
import { DeleteActionController } from '../useCases/data/Actions/DeleteAction/DeleteActionController';
import { DeleteAllActionController } from '../useCases/data/Actions/DeleteAllActions/DeleteALlActionController';
import { GetAllActionsController } from '../useCases/data/Actions/GetAllActions/GetAllActionsController';

const router = express.Router();

const getAllActionController = new GetAllActionsController();
const createActionController = new CreateActionController();
const deleteActionController = new DeleteActionController();
const deleteAllActionController = new DeleteAllActionController();

router.post(
  '/create/:pivot_id',
  authMiddleware(),
  createActionController.handle
);

router.get('/read', getAllActionController.handle);
router.delete('/del/:action_id', deleteActionController.handle);
router.delete('/delAll/:user_id', deleteAllActionController.handle);

export default router;
