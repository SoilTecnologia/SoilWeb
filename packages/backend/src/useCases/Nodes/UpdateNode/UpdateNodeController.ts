import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { UpdateNodeUseCase } from './UpdateNodeUseCase';

class UpdateNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_id, node_num, farm_id, is_gprs, gateway } = req.body;

    const updateNodeUseCase = container.resolve(UpdateNodeUseCase);

    try {
      const newNode = await updateNodeUseCase.execute({
        node_id,
        node_num,
        farm_id,
        is_gprs,
        gateway
      });

      res.send(newNode);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        UpdateNodeController.name,
        'Update Node '
      );
      next(err);
    }
  }
}

export { UpdateNodeController };
