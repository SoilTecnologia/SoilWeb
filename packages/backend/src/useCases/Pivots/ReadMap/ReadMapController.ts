import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { ReadMapUseCase } from './ReadMapUseCase';

class ReadMapController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const readMapUseCase = container.resolve(ReadMapUseCase);

    try {
      const pivotList = await readMapUseCase.execute(farm_id);
      res.json(pivotList);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/map`);
      console.log(err);
      next(err);
    }
  }
}

export { ReadMapController };
