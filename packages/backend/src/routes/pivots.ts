import express from 'express';
import {
  getCyclesFromPivot,
  getLastCycleFromPivot
} from '../controllers/cycles';
import {
  readAllPivotController,
  readListPivotController,
  readMapPivotController
} from '../controllers/pivots';
import { readPivotStateController } from '../controllers/states';
import authMiddleware from '../middlewares/auth';
import { authHandler, IUserAuthInfoRequest } from '../types/express';
import { CreatePivotController } from '../useCases/Pivots/CreatePivots/CreatePivotController';
import { DeletePivotController } from '../useCases/Pivots/DeletePivot/DeletePivotController';
import { GetAllPivotsController } from '../useCases/Pivots/GetAllPivots/GetAllPivotsController';
import { GetOnePivotController } from '../useCases/Pivots/GetOnePivot/GetOnePivotController';
import { UpdatePivotController } from '../useCases/Pivots/UpdatePivot/UpdatePivotController';

const router = express.Router();

const createPivotController = new CreatePivotController();
const getAllPivotsController = new GetAllPivotsController();
const getOnePivotController = new GetOnePivotController();
const deletePivotController = new DeletePivotController();
const updatePivotController = new UpdatePivotController();

router.get(
  '/readAll/:farm_id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { farm_id } = req.params;

      try {
        const allPivotsFromNode = await readAllPivotController(farm_id);

        res.send(allPivotsFromNode);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /pivots/readAll`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.get(
  '/state/:pivot_id',
  authMiddleware(),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { pivot_id } = req.params;

      try {
        const pivotState = await readPivotStateController(pivot_id);

        res.send(pivotState);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /pivots/state`);
        console.log(err);
        next(err);
      }
    }
  )
);

router.get(
  '/map/:farm_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { farm_id } = req.params;
    const { user_id } = req.user;

    try {
      const pivotList = await readMapPivotController(user_id, farm_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/map`);
      console.log(err);
      next(err);
    }
  })
);

router.get(
  '/cycles/:pivot_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id } = req.params;

    try {
      const pivotList = await getLastCycleFromPivot(pivot_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles`);
      console.log(err);
      next(err);
    }
  })
);

router.get(
  '/cycles/:pivot_id/:start/:end',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { pivot_id, start, end } = req.params;

    try {
      const pivotList = await getCyclesFromPivot(pivot_id, start, end);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles/start/end`);
      console.log(err);
      next(err);
    }
  })
);

router.get(
  '/list/:farm_id',
  authMiddleware(),
  authHandler(async (req, res, next) => {
    const { farm_id } = req.params;
    const { user_id } = req.user;

    try {
      const pivotList = await readListPivotController(user_id, farm_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/list`);
      console.log(err);
      next(err);
    }
  })
);

// router.post(
//   '/update/:pivot_id',
//   authMiddleware(),
//   authHandler(async (req, res, next) => {
//     const { pivot_id } = req.params;
//     const {
//       connection,
//       power,
//       water,
//       direction,
//       angle,
//       percentimeter,
//       timestamp
//     } = req.body;
//     const { father, rssi } = req.body;

//     try {
//       const updatedPivot = await updatePivotController(
//         pivot_id,
//         connection,
//         power,
//         water,
//         direction,
//         angle,
//         percentimeter,
//         timestamp,
//         father,
//         rssi
//       );

//       res.json(updatedPivot);
//     } catch (err) {
//       console.log(`[ERROR] Server 500 on /pivots/update`);
//       console.log(err);
//       next(err);
//     }
//   })
// );

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

export default router;
