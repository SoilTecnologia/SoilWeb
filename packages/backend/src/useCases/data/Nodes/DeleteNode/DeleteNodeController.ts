import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { DeleteNodeUseCase } from './DeleteNodeUseCase';

class DeleteNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteNodeUseCase = container.resolve(DeleteNodeUseCase);

    try {
      await deleteNodeUseCase.execute(id);

      res.sendStatus(200).send();
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteNodeController.name,
        'Delete Node '
      );
      next();
    }
  }
}

export { DeleteNodeController };
