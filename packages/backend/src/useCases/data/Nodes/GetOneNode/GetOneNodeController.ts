import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetOneNodeUseCase } from './GetOneNodeUseCase';
import { ParamsNotExpected } from '@root/protocols/errors';

class GetOneNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_id } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getOnenodeUseCase = container.resolve(GetOneNodeUseCase);

      try {
        const allNodesFromFarm = await getOnenodeUseCase.execute({
          node_id: node_id
        });

        return res.status(201).send(allNodesFromFarm);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          GetOneNodeController.name,
          'Get Node By Id'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetOneNodeController };
