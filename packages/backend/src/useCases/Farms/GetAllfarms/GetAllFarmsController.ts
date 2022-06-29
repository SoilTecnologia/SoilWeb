import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetAllFarmsUseCase } from './GetAllFarmsUseCase';

class GetAllFarmsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const getAllFarmsUseCase = container.resolve(GetAllFarmsUseCase);
    try {
      const allFarmsFromUser = await getAllFarmsUseCase.execute();

      res.status(200).send(allFarmsFromUser);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetAllFarmsController.name,
        'Get All Farms'
      );
      next();
    }
  }
}

export { GetAllFarmsController };
