import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetUserSchedulingAngleHistUseCase } from './GetUserSchedulingAngleHistUseCase';

class GetUserSchedulingAngleHistController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const getUserSchedulingAngleHistUseCase = container.resolve(GetUserSchedulingAngleHistUseCase);

    try {
      const allSchedulingAngleHistfromUser = await getUserSchedulingAngleHistUseCase.execute(id);

      res.status(200).send(allSchedulingAngleHistfromUser);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetUserSchedulingAngleHistController.name,
        'Get Schedulling History By Pivot Id'
      );
      next(err);
    }
  }
}

export { GetUserSchedulingAngleHistController };
