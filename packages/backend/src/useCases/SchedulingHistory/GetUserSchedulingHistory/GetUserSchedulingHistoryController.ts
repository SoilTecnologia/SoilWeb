import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetUserSchedulingHistoryUseCase } from './GetUserSchedulingHistoryUseCase';

class GetUserSchedulingHistoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const getUserSchedulingHistoryUseCase = container.resolve(GetUserSchedulingHistoryUseCase);

    try {
      const allSchedulingHistoryfromUser = await getUserSchedulingHistoryUseCase.execute(id);

      res.status(200).send(allSchedulingHistoryfromUser);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetUserSchedulingHistoryController.name,
        'Get Schedulling History By Pivot Id'
      );
      next(err);
    }
  }
}

export { GetUserSchedulingHistoryController };
