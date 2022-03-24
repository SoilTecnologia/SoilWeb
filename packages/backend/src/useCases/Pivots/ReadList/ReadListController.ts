import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { ReadListPivotUseCase } from './ReadListUseCase';

class ReadListController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;
    const readListPivotUseCase = container.resolve(ReadListPivotUseCase);

    try {
      const pivotList = await readListPivotUseCase.execute(farm_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/list`);
      console.log(err);
      next(err);
    }
  }
}

export { ReadListController };
