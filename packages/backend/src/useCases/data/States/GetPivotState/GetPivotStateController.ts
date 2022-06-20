import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetPivotStateUseCase } from './GetPivotStateUseCase';

class GetPivotStateController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    try {
      const getPivotStateUseCase = container.resolve(GetPivotStateUseCase);

      const pivotState = await getPivotStateUseCase.execute(pivot_id);

      res.status(200).send(pivotState);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetPivotStateController.name,
        'Get State Pivot'
      );
      next();
    }
  }
}

export { GetPivotStateController };
