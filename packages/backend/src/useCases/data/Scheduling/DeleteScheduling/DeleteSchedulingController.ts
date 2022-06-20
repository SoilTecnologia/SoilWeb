import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { DeleteSchedulingUseCase } from './DeleteSchedulingUseCase';

class DeleteSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const deleteSchedulingUseCase = container.resolve(DeleteSchedulingUseCase);

    try {
      const allSchedulingsFromPivots = await deleteSchedulingUseCase.execute(
        id
      );

      res.sendStatus(200).send(allSchedulingsFromPivots);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteSchedulingController.name,
        'Delete Scheduling'
      );
      next(err);
    }
  }
}

export { DeleteSchedulingController };
