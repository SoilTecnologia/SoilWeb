import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSchedulingAngleUseCase } from './CreateSchedulingAngleUseCase';

class CreateSchedulingAngleController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      author,
      pivot_id,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      timestamp
    } = req.body;

    const createSchedulingAngleUseCase = container.resolve(
      CreateSchedulingAngleUseCase
    );

    try {
      const allSchedulingAngle = await createSchedulingAngleUseCase.execute({
        pivot_id,
        author,
        power,
        water,
        direction,
        percentimeter,
        start_angle,
        end_angle,
        timestamp: new Date()
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
