import { ParamsNotExpected, TypeParamError } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetByNumByFarmUseCase } from './GetByNumByFarmUseCase';

class GetByNumByFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id, node_num } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getByNumByFarmUseCase = container.resolve(GetByNumByFarmUseCase);
      try {
        const allNodesFromFarm = await getByNumByFarmUseCase.execute({
          farm_id,
          node_num: Number(node_num)
        });

        return res.status(201).send(allNodesFromFarm);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          GetByNumByFarmController.name,
          'Get Node By Farm and Node Num'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetByNumByFarmController };
