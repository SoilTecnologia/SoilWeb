import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeleteAllActionsUseCase } from './DeleteAllActionsByAuthorUseCase';

class DeleteAllActionController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.params;
    const deleteAllActionUseCase = container.resolve(DeleteAllActionsUseCase);
    try {
      const result = await deleteAllActionUseCase.execute(user_id);

      result ? res.status(200).send(result) : res.status(400).send('Not found');
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteAllActionController.name,
        'Delete All Action'
      );
    }
  }
}

export { DeleteAllActionController };
