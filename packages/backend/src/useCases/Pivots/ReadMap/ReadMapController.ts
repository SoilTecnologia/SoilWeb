import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { ReadMapUseCase } from './ReadMapUseCase';

class ReadMapController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const readMapUseCase = container.resolve(ReadMapUseCase);

    try {
      const pivotList = await readMapUseCase.execute(farm_id);
      res.json(pivotList);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ReadMapController.name,
        'Read Map Pivots'
      );
      next(err);
    }
  }
}

export { ReadMapController };
