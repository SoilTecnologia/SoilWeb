import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { ReadPivotStateUseCase } from './ReadPivotStateUseCase';

class ReadPivotStateController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    const readPivotStateUseCase = container.resolve(ReadPivotStateUseCase);

    try {
      const pivotState = await readPivotStateUseCase.execute(pivot_id);

      res.send(pivotState);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ReadPivotStateController.name,
        'Read State Pivot'
      );
      next();
    }
  }
}

export { ReadPivotStateController };
