import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetPivotStateUseCase } from './GetPivotStateUseCase';

class GetPivotStateController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    try {
      const getPivotStateUseCase = container.resolve(GetPivotStateUseCase);

      const pivotState = await getPivotStateUseCase.execute(pivot_id);

      res.status(200).send(pivotState);
    } catch (err) {
      console.log('ERROR');
      console.log(err);
      next(err);
    }
  }
}

export { GetPivotStateController };
