import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetByNumByFarmUseCase } from './GetByNumByFarmUseCase';

class GetByNumByFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id, node_num } = req.params;

    const getByNumByFarmUseCase = container.resolve(GetByNumByFarmUseCase);

    try {
      const allNodesFromFarm = await getByNumByFarmUseCase.execute(
        farm_id,
        Number(node_num)
      );

      res.send(allNodesFromFarm);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetByNumByFarmController.name,
        'Get Node By Farm and Node Num'
      );
      next();
    }
  }
}

export { GetByNumByFarmController };
