import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetPivotSchedulingHistoryUseCase } from './GetPivotSchedulingHistoryUseCase';

class GetPivotSchedulingHistoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const getPivotSchedulingHistoryUseCase = container.resolve(GetPivotSchedulingHistoryUseCase);

    try {
      const allSchedulingHistoryfromPivot = await getPivotSchedulingHistoryUseCase.execute(id);

      res.status(200).send(allSchedulingHistoryfromPivot);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetPivotSchedulingHistoryController.name,
        'Get Schedulling History By Pivot Id'
      );
      next(err);
    }
  }
}

export { GetPivotSchedulingHistoryController };
