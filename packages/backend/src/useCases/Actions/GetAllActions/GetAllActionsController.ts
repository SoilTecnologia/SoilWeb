import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetAllActionsUseCase } from './GetAllActionUseCase';

class GetAllActionsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const getAllActionUseCase = container.resolve(GetAllActionsUseCase);
    try {
      const actions = await getAllActionUseCase.execute();

      res.json(actions);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetAllActionsController.name,
        'Get All Actions'
      );
      next();
    }
  }
}

export { GetAllActionsController };
