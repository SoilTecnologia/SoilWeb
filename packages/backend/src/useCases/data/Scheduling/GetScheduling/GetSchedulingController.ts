import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetSchedulingUseCase } from './GetSchedulingUseCase';

class GetSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log(`Recebido em get Scheduling: ${id}`);
    const getSchedulingUseCase = container.resolve(GetSchedulingUseCase);

    try {
      const allSchedulingfromPivot = await getSchedulingUseCase.execute(id);
      res.status(200).send(allSchedulingfromPivot);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetSchedulingController.name,
        'Get Schedulling By Pivot Id'
      );
      next(err);
    }
  }
}

export { GetSchedulingController };
