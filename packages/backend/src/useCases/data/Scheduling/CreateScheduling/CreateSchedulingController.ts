import { checkReqData } from '@root/utils/decorators/check-types';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import { messageErrorTryAction } from '@utils/types';
import { CreateSchedulingUseCase } from './CreateSchedulingUseCase';

dayjs.extend(utc);
dayjs.extend(timezone);
class CreateSchedulingController {
  @checkReqData(10)
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

      return res.status(201).send(allScheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreateSchedulingController.name,
        'CreateScheduling'
      );
      res.status(400).send({ error: err.message });
    }
  }
}

export { CreateSchedulingController };
