import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateActionController } from '../useCases/Actions/CreateAction/CreateActionController';
import { DeleteActionController } from '../useCases/Actions/DeleteAction/DeleteActionController';
import { DeleteAllActionController } from '../useCases/Actions/DeleteAllActions/DeleteALlActionController';
import { GetAllActionsController } from '../useCases/Actions/GetAllActions/GetAllActionsController';

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
