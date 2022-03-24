import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllActionsUseCase } from './GetAllActionUseCase';

class GetAllActionsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const getAllActionUseCase = container.resolve(GetAllActionsUseCase);
    try {
      const actions = await getAllActionUseCase.execute();

      res.json(actions);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /actions/read`);
      console.log(err);
      next(err);
    }
  }
}

export { GetAllActionsController };
