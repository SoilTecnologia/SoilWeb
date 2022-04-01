import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { ReadAllUseCase } from './ReadAllUseCase';

class ReadAllController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const realdAllUseCase = container.resolve(ReadAllUseCase);

    try {
      const allPivotsFromNode = await realdAllUseCase.execute(farm_id);

      res.status(200).send(allPivotsFromNode);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ReadAllController.name,
        'Read All data Pivot'
      );
      next(err);
    }
  }
}

export { ReadAllController };
