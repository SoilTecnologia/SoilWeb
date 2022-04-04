import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetLastCycleUseCase } from './GetLastCycleUseCase';

class GetLastCycleController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;

    const getLastCycleUseCase = container.resolve(GetLastCycleUseCase);

    try {
      const pivotList = await getLastCycleUseCase.execute(pivot_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles`);
      console.log(err);
      next();
    }
  }
}

export { GetLastCycleController };
