import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllByFarmIdUseCase } from './GetAllByFarmIdUseCase';

class GetAllByFarmIdController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const getAllByFarmsIdUseCase = container.resolve(GetAllByFarmIdUseCase);

    try {
      const allNodesFromFarm = await getAllByFarmsIdUseCase.execute(farm_id);

      res.json(allNodesFromFarm);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /nodes/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetAllByFarmIdController };
