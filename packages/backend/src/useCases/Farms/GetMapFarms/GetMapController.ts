import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetMapFarmUseCase } from './GetMapFarmsuseCase';

class GetMapFarmsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const getMapFarmsUseCase = container.resolve(GetMapFarmUseCase);

    try {
      const result = await getMapFarmsUseCase.execute(farm_id);

      res.json(result);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetMapFarmsController.name,
        'Get Map Farms '
      );
      next();
    }
  }
}

export { GetMapFarmsController };
