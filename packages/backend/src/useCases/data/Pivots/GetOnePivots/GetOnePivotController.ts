import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetOnePivotUseCase } from './GetOnePivotUseCase';

class GetOnePivotController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_num, farm_id } = req.params;
    const getOnePivotUseCase = container.resolve(GetOnePivotUseCase);
    try {
      const pivotResult = await getOnePivotUseCase.execute(
        Number(pivot_num),
        farm_id
      );

      res.send(pivotResult);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetOnePivotController.name,
        'Get One Pivot Of The Farm'
      );
      next();
    }
  }
}

export { GetOnePivotController };
