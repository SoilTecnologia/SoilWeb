import { ParamsNotExpected } from '@root/protocols/errors';
import { timeStamp } from 'console';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import {
  dateSaoPaulo,
  dateString
} from '../../../../utils/convertTimeZoneDate';
import { dateJs } from '../../../../utils/handleDates/dateFactory';
import { messageErrorTryAction } from '../../../../utils/types';
import { CreateSchedulingUseCase } from './CreateSchedulingUseCase';

dayjs.extend(utc);
dayjs.extend(timezone);
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

    if (Object.keys(req.body).length > 10) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const createSchedulingUseCase = container.resolve(
        CreateSchedulingUseCase
      );

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
}

export { CreateSchedulingController };
