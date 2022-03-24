import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
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
      console.log(`[ERROR] Server 500 on /nodes/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetByNumByFarmController };
