import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateSchedulingUseCase } from './CreateSchedulingUseCase';

class CreateSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      pivot_id,
      author,
      is_stop,
      power,
      water,
      direction,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = req.body;
    console.log(`Recebido: ${pivot_id}`);
    const createSchedulingUseCase = container.resolve(CreateSchedulingUseCase);

    try {
      const allScheduling = await createSchedulingUseCase.execute({
        pivot_id,
        author,
        is_stop,
        power,
        water,
        direction,
        percentimeter,
        start_timestamp,
        end_timestamp,
        timestamp
      });

      res.send(allScheduling);
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
