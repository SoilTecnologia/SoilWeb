import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateFarmUseCase } from './CreateFarmUseCase';

class CreateFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      farm_id,
      user_id,
      farm_name,
      farm_city,
      farm_lng,
      farm_lat
    }: FarmModel = req.body;
    
    const createFarmUseCase = container.resolve(CreateFarmUseCase);

    const newFarm = {
      farm_id,
      user_id,
      farm_name,
      farm_city,
      farm_lng,
      farm_lat
    };

    try {
      const farm = await createFarmUseCase.execute(newFarm);
      res.status(200).send(farm);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreateFarmController.name,
        'Create Farm'
      );
      next();
    }
  }
}

export { CreateFarmController };
