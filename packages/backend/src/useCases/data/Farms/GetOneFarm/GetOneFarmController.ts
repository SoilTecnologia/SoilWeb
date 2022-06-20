import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetOneFarmUseCase } from './GetOneFarmsuseCase';

class GetOneFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farmId } = req.params;

    const getOneFarmUseCase = container.resolve(GetOneFarmUseCase);

    try {
      const allFarmsFromUser = await getOneFarmUseCase.execute(farmId);

      res.status(200).send(allFarmsFromUser);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetOneFarmController.name,
        'Get One Farm'
      );
      next();
    }
  }
}

export { GetOneFarmController };
