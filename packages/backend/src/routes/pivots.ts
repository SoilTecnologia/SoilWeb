import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { readAllPivotController } from '../controllers/pivots';

const router = express.Router();

router.get(
  '/readAll/:farm_id',
  authMiddleware(['USER', 'SUDO']),
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
        console.log(`Server 500: ${err}`);
        next(err);
      }
    }
  )
);

export default router;
