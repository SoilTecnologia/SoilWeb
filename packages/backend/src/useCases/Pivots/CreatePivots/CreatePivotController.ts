import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { CreatePivotUseCase } from './CreatePivotUseCase';

class CreatePivotController {
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
      farm_id
    } = req.body;

    const createPivotUseCase = container.resolve(CreatePivotUseCase);

    try {
      const allPivotsFromNode = await createPivotUseCase.execute({
        pivot_num,
        pivot_lng,
        pivot_lat,
        pivot_start_angle,
        pivot_end_angle,
        pivot_radius,
        radio_id,
        node_id,
        farm_id
      });

      res.send(allPivotsFromNode);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreatePivotController.name,
        'Create Pivot'
      );
      next();
    }
  }
}

export { CreatePivotController };
