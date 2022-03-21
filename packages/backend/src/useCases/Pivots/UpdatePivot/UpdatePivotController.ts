import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdatePivotUseCase } from './UpdatePivotUseCase';

class UpdatePivotController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      pivot_num,
      pivot_lng,
      pivot_lat,
      pivot_start_angle,
      pivot_end_angle,
      pivot_radius,
      radio_id,
      node_id,
      farm_id,
      pivot_id
    } = req.body;

    const updatePivotUseCase = container.resolve(UpdatePivotUseCase);

    try {
      const pivotNew = await updatePivotUseCase.execute({
        pivot_num,
        pivot_lng,
        pivot_lat,
        pivot_start_angle,
        pivot_end_angle,
        pivot_radius,
        radio_id,
        node_id,
        farm_id,
        pivot_id
      });

      res.status(200).send(pivotNew);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { UpdatePivotController };
