import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetMapFarmUseCase } from './GetMapFarmsuseCase';

class GetMapFarmsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const getMapFarmsUseCase = container.resolve(GetMapFarmUseCase);

    try {
      const result = await getMapFarmsUseCase.execute(farm_id);

      res.json(result);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/map`);
      console.log(err);
      next(err);
    }
  }
}

export { GetMapFarmsController };
