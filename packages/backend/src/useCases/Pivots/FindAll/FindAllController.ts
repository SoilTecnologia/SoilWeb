import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { FindAllUseCase } from './FindAllUseCase';

class FindAllController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const findAlluseCase = container.resolve(FindAllUseCase);

    try {
      const pivots = await findAlluseCase.execute();
      res.status(200).send(pivots);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        FindAllController.name,
        'Get All Pivots'
      );
      next();
    }
  }
}

export { FindAllController };
