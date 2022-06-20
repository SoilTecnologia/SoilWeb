import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetPumpUseCase } from './GetPumpUseCase';

class GetPumpController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const getPumpUseCase = container.resolve(GetPumpUseCase);

    try {
      const allPumpfromPivot = await getPumpUseCase.execute(id);

      res.status(200).send(allPumpfromPivot);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetPumpController.name,
        'Get Pump By Pivot Id'
      );
      next(err);
    }
  }
}

export { GetPumpController };
