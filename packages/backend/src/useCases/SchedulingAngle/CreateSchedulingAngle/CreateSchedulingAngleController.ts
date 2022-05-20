import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSchedulingAngleUseCase } from './CreateSchedulingAngleUseCase';

class CreateSchedulingAngleController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      author,
      pivot_id,
      is_return,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      start_timestamp,
      timestamp
    } = req.body;
    const data = req.body;
    console.log(`Cheguei na requisição ${pivot_id}`);
    console.log(data);

    const createSchedulingAngleUseCase = container.resolve(
      CreateSchedulingAngleUseCase
    );

    try {
      const allSchedulingAngle = await createSchedulingAngleUseCase.execute({
        pivot_id,
        is_return,
        author,
        power,
        water,
        direction,
        percentimeter,
        start_angle,
        end_angle,
        start_timestamp,
        timestamp
      });

      res.send(allSchedulingAngle);
    } catch (err) {
      console.log(
        `[ERROR] Server 500 on /schedulingAngle/createSchedulingAngle`
      );
      console.log(err);
      next(err);
    }
  }
}

export { CreateSchedulingAngleController };
