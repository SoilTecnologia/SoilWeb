import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateSchedulingUseCase } from './CreateSchedulingUseCase';

class CreateSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      pivot_id,
      power,
      water,
      direction,
      start_angle,
      end_angle,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = req.body;

    const createSchedulingUseCase = container.resolve(CreateSchedulingUseCase);

    try {
      const allScheduling = await createSchedulingUseCase.execute({
        pivot_id,
        power,
        water,
        direction,
        start_angle,
        end_angle,
        percentimeter,
        start_timestamp,
        end_timestamp,
        timestamp
      });

      res.send(allScheduling);
      console.log('seeend', allScheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreateSchedulingController.name,
        'CreateScheduling'
      );
      next(err);
    }
  }
}

export { CreateSchedulingController };
