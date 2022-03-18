import { NextFunction, Request, Response } from 'express';
import { UpdateFarmUseCase } from './UpdateFarmUseCase';

class UpdateFarmController {
  constructor(private updateFarmUseCase: UpdateFarmUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const farm = req.body;
    try {
      const putFarm = await this.updateFarmUseCase.execute(farm);

      res.status(200).send(putFarm);
    } catch (err) {
      console.log('[ERROR] Internal Server error');
      console.log(err);
      next(err);
    }
  }
}

export { UpdateFarmController };
