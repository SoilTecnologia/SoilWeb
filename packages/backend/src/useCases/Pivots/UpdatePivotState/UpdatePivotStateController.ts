import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdatePivotStateUseCase } from './UpdatePivotStateUseCase';

class UpdateStatePivotController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    const {
      connection,
      power,
      water,
      direction,
      angle,
      percentimeter,
      timestamp,
      father,
      rssi
    } = req.body;

    const updatePivotState = container.resolve(UpdatePivotStateUseCase);

    try {
      const updatedPivot = await updatePivotState.execute(
        pivot_id,
        connection,
        power,
        water,
        direction,
        angle,
        percentimeter,
        timestamp,
        father,
        rssi
      );

      res.json(updatedPivot);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/update`);
      console.log(err);
      next(err);
    }
  }
}

export { UpdateStatePivotController };
