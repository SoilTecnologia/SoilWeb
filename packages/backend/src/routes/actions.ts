import express from 'express';
import authMiddleware from '../middlewares/auth';
import { CreateActionController } from '../useCases/Actions/CreateAction/CreateActionController';
import { GetAllActionsController } from '../useCases/Actions/GetAllActions/GetAllActionsController';

const router = express.Router();

const getAllActionController = new GetAllActionsController();
const createActionController = new CreateActionController();

router.post(
  '/create/:pivot_id',
  authMiddleware(),
  createActionController.handle
);

router.get('/read', getAllActionController.handle);

export default router;
