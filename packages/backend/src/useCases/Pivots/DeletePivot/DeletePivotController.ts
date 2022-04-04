import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeletePivotUseCase } from './DeletePivotUseCase';

class DeletePivotController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deletePivotUseCase = container.resolve(DeletePivotUseCase);

    try {
      const allPivotsFromNode = await deletePivotUseCase.execute(id);

      res.sendStatus(200).send(allPivotsFromNode);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeletePivotController.name,
        'Delete Pivot'
      );
      next();
    }
  }
}

export { DeletePivotController };
