import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetOneNodeUseCase } from './GetOneNodeUseCase';

class GetOneNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_id } = req.params;

    const getOnenodeUseCase = container.resolve(GetOneNodeUseCase);

    try {
      const allNodesFromFarm = await getOnenodeUseCase.execute(node_id);

      res.status(200).send(allNodesFromFarm);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetOneNodeController.name,
        'Get Node By Id'
      );
      next();
    }
  }
}

export { GetOneNodeController };
