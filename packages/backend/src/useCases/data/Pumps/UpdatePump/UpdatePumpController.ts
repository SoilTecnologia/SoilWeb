import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { UpdatePumpUseCase } from './UpdatePumpUseCase';

class UpdatePumpController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const pump = req.body;
    const updatePumpUseCase = container.resolve(UpdatePumpUseCase);
    try {
      const putPump = await updatePumpUseCase.execute(pump);

      res.status(200).send(putPump);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePumpController.name,
        'Update Pump'
      );
      next(err);
    }
  }
}

export { UpdatePumpController };
