import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { DeleteNodeUseCase } from './DeleteNodeUseCase';

class DeleteNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (Object.keys(req.body).length > 0) {
      throw new ParamsNotExpected();
    }

    const deleteNodeUseCase = container.resolve(DeleteNodeUseCase);

    try {
      await deleteNodeUseCase.execute({ node_id: id });

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
