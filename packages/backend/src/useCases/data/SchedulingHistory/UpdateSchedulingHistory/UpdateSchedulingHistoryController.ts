import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { UpdateSchedulingHistoryUseCase } from './UpdateSchedulingHistoryUseCase';

class UpdateSchedulingHistoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const schedulingHistory = req.body;
    const updateSchedulingHistoryUseCase = container.resolve(
      UpdateSchedulingHistoryUseCase
    );
    try {
      const putSchedulingHistory = await updateSchedulingHistoryUseCase.execute(
        schedulingHistory
      );

      res.status(200).send(putSchedulingHistory);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingHistoryController.name,
        'Update Scheduling History'
      );
      next(err);
    }
  }
}

export { UpdateSchedulingHistoryController };
