import { NextFunction, Request, Response } from 'express';
import { GetMapFarmUseCase } from './GetMapFarmsuseCase';

class GetMapFarmsController {
  constructor(private getMapFarmsUsecase: GetMapFarmUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    try {
      const result = await this.getMapFarmsUsecase.execute(farm_id);

      res.json(result);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/map`);
      console.log(err);
      next(err);
    }
  }
}

export { GetMapFarmsController };
