import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { DeleteNodeUseCase } from './DeleteNodeUseCase';

class DeleteNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const deleteNodeUseCase = container.resolve(DeleteNodeUseCase);

      try {
        const response = await deleteNodeUseCase.execute({ node_id: id });

        return res.status(201).send(response);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          DeleteNodeController.name,
          'Delete Node '
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { DeleteNodeController };
