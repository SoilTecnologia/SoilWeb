import express from 'express';
import authMiddleware from '../middlewares/auth';
import { GetCycleController } from '../useCases/Cycles/GetCycles/GetCycleController';
import { GetLastCycleController } from '../useCases/Cycles/GetLastCycles/GetLastCyclesController';
import { CreatePivotController } from '../useCases/Pivots/CreatePivots/CreatePivotController';
import { DeletePivotController } from '../useCases/Pivots/DeletePivot/DeletePivotController';
import { GetAllPivotsController } from '../useCases/Pivots/GetAllPivots/GetAllPivotsController';
import { GetOnePivotController } from '../useCases/Pivots/GetOnePivot/GetOnePivotController';
import { ReadAllController } from '../useCases/Pivots/ReadAll/ReadAllController';
import { ReadListController } from '../useCases/Pivots/ReadList/ReadListController';
import { ReadMapController } from '../useCases/Pivots/ReadMap/ReadMapController';
import { ReadPivotStateController } from '../useCases/Pivots/ReadPivotState/ReadPivotController';
import { UpdatePivotController } from '../useCases/Pivots/UpdatePivot/UpdatePivotController';
import { UpdateStatePivotController } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateController';

const router = express.Router();

const createPivotController = new CreatePivotController();
const getAllPivotsController = new GetAllPivotsController();
const getOnePivotController = new GetOnePivotController();
const deletePivotController = new DeletePivotController();
const updatePivotController = new UpdatePivotController();
const readAllController = new ReadAllController();
const readMapController = new ReadMapController();
const readListPivotController = new ReadListController();
const readPivotStateController = new ReadPivotStateController();
const updatePivotStateController = new UpdateStatePivotController();

// cycles
const getLastCycleController = new GetLastCycleController();
const getCycleController = new GetCycleController();

router.get('/readAll/:farm_id', authMiddleware(), readAllController.handle);
router.get('/map/:farm_id', authMiddleware(), readMapController.handle);
router.get(
  '/state/:pivot_id',
  authMiddleware(),
  readPivotStateController.handle
);
router.get('/list/:farm_id', authMiddleware(), readListPivotController.handle);
router.post(
  '/update/:pivot_id',
  authMiddleware(),
  updatePivotStateController.handle
);

// Admin
router.get('/getPivots/:id', authMiddleware(), getAllPivotsController.handle);

router.get(
  '/getOnePivot/:pivot_num/:farm_id',
  authMiddleware(),
  getOnePivotController.handle
);

router.post('/addPivot', authMiddleware(), createPivotController.handle);

router.delete(
  '/deletePivot/:id',
  authMiddleware(),
  deletePivotController.handle
);

router.put('/putPivot', authMiddleware(), updatePivotController.handle);

router.get(
  '/cycles/:pivot_id',
  authMiddleware(),
  getLastCycleController.handle
);

router.get(
  '/cycles/:pivot_id/:start/:end',
  authMiddleware(),
  getCycleController.handle
);

export default router;
