import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { UpdateSchedulingUseCase } from './UpdateSchedulingUseCase';

class UpdateSchedulingController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      scheduling_id,
      pivot_id,
      author,
      is_stop,
      power,
      water,
      direction,
      percentimeter,
      update_timestamp,
      start_timestamp,
      end_timestamp
    } = req.body;
    const updateSchedulingUseCase = container.resolve(UpdateSchedulingUseCase);
    try {
      const putScheduling = await updateSchedulingUseCase.execute(
        {
          scheduling_id,
          pivot_id,
          author,
          is_stop,
          power,
          water,
          direction,
          percentimeter,
          start_timestamp,
          end_timestamp
        },
        dayjs(Date.now()).toDate()
      );

      res.status(200).send(putScheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingController.name,
        'Update Scheduling'
      );
      next(err);
    }
  }
}

export { UpdateSchedulingController };
