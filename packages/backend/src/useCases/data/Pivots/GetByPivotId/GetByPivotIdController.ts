import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetByPivotIdUseCase } from './GetByPivotIdUseCase';

class GetByPivotIdController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    const getByPivotIdUseCase = container.resolve(GetByPivotIdUseCase);
    try {
      const pivotResult = await getByPivotIdUseCase.execute(pivot_id);

      res.send(pivotResult);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetByPivotIdController.name,
        'Get One Pivot Of The Farm'
      );
      next();
    }
  }
}

export { GetByPivotIdController };
