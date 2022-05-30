import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateSchedulingAngleUseCase } from './UpdateSchedulingAngleUseCase';

class UpdateSchedulingAngleController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      update_timestamp,
      scheduling_angle_id,
      is_return,
      pivot_id,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      start_timestamp,
      timestamp
    } = req.body;
    const updateSchedulingAngleUseCase = container.resolve(
      UpdateSchedulingAngleUseCase
    );
    try {
      const putSchedulingAngle = await updateSchedulingAngleUseCase.execute(
        {
          scheduling_angle_id,
          is_return,
          pivot_id,
          author,
          power,
          water,
          direction,
          percentimeter,
          start_angle,
          end_angle,
          start_timestamp,
          timestamp
        },
        dayjs(Date.now()).toDate()
      );

      res.status(200).send(putSchedulingAngle);
    } catch (err) {
      console.log('[ERROR] Internal Server error');
      console.log(err);
      next(err);
    }
  }
}

export { UpdateSchedulingAngleController };
