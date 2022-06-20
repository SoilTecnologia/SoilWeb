import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { UpdateFarmUseCase } from './UpdateFarmUseCase';

class UpdateFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const farm = req.body;
    const updateFarmUseCase = container.resolve(UpdateFarmUseCase);
    try {
      const putFarm = await updateFarmUseCase.execute(farm);

      res.status(200).send(putFarm);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        UpdateFarmController.name,
        'Update Farm'
      );
      next();
    }
  }
}

export { UpdateFarmController };
