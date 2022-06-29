import express from 'express';
import authMiddleware from '@protocols/middlewares/auth';
import { CreatePivotController } from '@useCases/data/Pivots/CreatePivots/CreatePivotController';
import { DeletePivotController } from '@useCases/data/Pivots/DeletePivot/DeletePivotController';
import { FindAllController } from '@useCases/data/Pivots/FindAll/FindAllController';
import { GetAllPivotsController } from '@useCases/data/Pivots/GetAllPivots/GetAllPivotsController';
import { GetByPivotIdController } from '@useCases/data/Pivots/GetByPivotId/GetByPivotIdController';
import { GetOnePivotController } from '@useCases/data/Pivots/GetOnePivots/GetOnePivotController';
import { ReadAllController } from '@useCases/data/Pivots/ReadAll/ReadAllController';
import { ReadListController } from '@useCases/data/Pivots/ReadList/ReadListController';
import { ReadMapController } from '@useCases/data/Pivots/ReadMap/ReadMapController';
import { ReadPivotStateController } from '@useCases/data/Pivots/ReadPivotState/ReadPivotController';
import { UpdatePivotController } from '@useCases/data/Pivots/UpdatePivot/UpdatePivotController';
import { UpdateStatePivotController } from '@useCases/data/Pivots/UpdatePivotState/UpdatePivotStateController';
import { GetPivotStateAndVariablesRepo } from '@root/database/repositories/States/get-variables-by-state';

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
const findAllController = new FindAllController();
const getByPivotId = new GetByPivotIdController();

router.get('/readAll/:farm_id', authMiddleware(), readAllController.handle);

router.get('/map/:farm_id', authMiddleware(), readMapController.handle);

router.get(
  '/state/:pivot_id',
  authMiddleware(),
  readPivotStateController.handle
);
router.get('/list/:farm_id', authMiddleware(), readListPivotController.handle);
router.get('/findAll', authMiddleware(), findAllController.handle);
router.get('/pivotById/:pivot_id', authMiddleware(), getByPivotId.handle);

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

router.get('/full/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const repo = new GetPivotStateAndVariablesRepo();
    const result = await repo.get({ pivot_id: id });

    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
