import { timeStamp } from 'console';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { dateSaoPaulo, dateString } from '../../../utils/convertTimeZoneDate';
import { dateJs } from '../../../utils/handleDates/dateFactory';
import { messageErrorTryAction } from '../../../utils/types';
import { CreateSchedulingUseCase } from './CreateSchedulingUseCase';

dayjs.extend(utc)
dayjs.extend(timezone)
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

    console.log(`
      Data de inicion: ${dateSaoPaulo(start_timestamp)},
      Data de termino: ${dateSaoPaulo(end_timestamp)},
      Data de criação: ${dateSaoPaulo(timestamp)},
      Date String: ${dateString(dateSaoPaulo(timestamp))}
    `)
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
