import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeleteNodeUseCase } from './DeleteNodeUseCase';

class DeleteNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteNodeUseCase = container.resolve(DeleteNodeUseCase);

    try {
      const newNode = await deleteNodeUseCase.execute(id);

      res.send(newNode);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteNodeController.name,
        'Delete Node '
      );
      next(err);
    }
  }
}

export { DeleteNodeController };
