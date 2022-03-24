import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { ReadPivotStateUseCase } from './ReadPivotStateUseCase';

class ReadPivotStateController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    const readPivotStateUseCase = container.resolve(ReadPivotStateUseCase);

    try {
      const pivotState = await readPivotStateUseCase.execute(pivot_id);

      res.send(pivotState);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/state`);
      console.log(err);
      next(err);
    }
  }
}

export { ReadPivotStateController };
