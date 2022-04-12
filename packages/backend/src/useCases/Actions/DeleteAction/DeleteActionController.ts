import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeleteActionUseCase } from './DeleteACtionUseCase';

class DeleteActionController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { action_id } = req.params;
    const deleteActionUseCase = container.resolve(DeleteActionUseCase);
    try {
      const result = await deleteActionUseCase.execute(action_id);

      res.status(200).send(result);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteActionController.name,
        'Delete Action'
      );
    }
  }
}

export { DeleteActionController };
