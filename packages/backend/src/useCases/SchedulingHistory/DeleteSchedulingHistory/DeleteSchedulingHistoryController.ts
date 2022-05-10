import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeleteSchedulingHistoryUseCase } from './DeleteSchedulingHistoryUseCase';

class DeleteSchedulingHistoryController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const deleteSchedulingHistoryUseCase = container.resolve(DeleteSchedulingHistoryUseCase);

    try {
      const allSchedulingsHistoryFromPivots = await deleteSchedulingHistoryUseCase.execute(
        id
      );

      res.sendStatus(200).send(allSchedulingsHistoryFromPivots);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteSchedulingHistoryController.name,
        'Delete Scheduling History'
      );
      next(err);
    }
  }
}

export { DeleteSchedulingHistoryController };
