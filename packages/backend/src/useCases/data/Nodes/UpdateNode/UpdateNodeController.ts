import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { UpdateNodeUseCase } from './UpdateNodeUseCase';

class UpdateNodeController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { node_id, node_num, farm_id, is_gprs, gateway } = req.body;

    console.log(req.body);

    if (Object.keys(req.body).length > (gateway ? 5 : 4)) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const updateNodeUseCase = container.resolve(UpdateNodeUseCase);

      try {
        const newNode = await updateNodeUseCase.execute({
          node_id,
          node_num,
          farm_id,
          is_gprs,
          gateway
        });

        res.status(201).send(newNode);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          UpdateNodeController.name,
          'Update Node '
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { UpdateNodeController };
