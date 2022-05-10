import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { UpdateSchedulingUseCase } from './UpdateSchedulingUseCase';

class UpdateSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const scheduling = req.body;
    const updateSchedulingUseCase = container.resolve(UpdateSchedulingUseCase);
    try {
      const putScheduling = await updateSchedulingUseCase.execute(scheduling);

      res.status(200).send(putScheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingController.name,
        'Update Scheduling'
      );
      next(err);
    }
  }
}

export { UpdateSchedulingController };
