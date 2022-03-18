import { NextFunction, Request, Response } from 'express';
import Farm from '../../../models/farm';
import { CreateFarmUseCase } from './CreateFarmUseCase';

class CreateFarmController {
  constructor(private createFarmUseCase: CreateFarmUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id, user_id, farm_name, farm_city, farm_lng, farm_lat }: Farm =
      req.body;

    const newFarm = {
      farm_id,
      user_id,
      farm_name,
      farm_city,
      farm_lng,
      farm_lat
    };

    try {
      const farm = await this.createFarmUseCase.execute(newFarm);
      res.status(200).send(farm);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /users/addFarm!`);
      console.log(err);
      next(err);
    }
  }
}

export { CreateFarmController };
