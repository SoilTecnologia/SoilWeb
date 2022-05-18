import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateSchedulingHistoryUseCase } from './CreateSchedulingHistoryUseCase';

class CreateSchedulingHistoryController {
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

    const createSchedulingHistoryUseCase = container.resolve(CreateSchedulingHistoryUseCase);

    try {
      const allSchedulingHistory = await createSchedulingHistoryUseCase.execute({
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

      res.send(allSchedulingHistory);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreateSchedulingHistoryController.name,
        'CreateSchedulingHistory'
      );
      next(err);
    }
  }
}

export { CreateSchedulingHistoryController };
