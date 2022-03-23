import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetCyclesUseCase } from './GetCyclesUseCase';

class GetCycleController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id, start, end } = req.params;

    const getCyclesUseCase = container.resolve(GetCyclesUseCase);

    try {
      const pivotList = await getCyclesUseCase.execute(pivot_id, start, end);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/cycles/start/end`);
      console.log(err);
      next(err);
    }
  }
}

export { GetCycleController };
