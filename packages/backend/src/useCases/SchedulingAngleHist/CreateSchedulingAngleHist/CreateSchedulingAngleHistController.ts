import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateSchedulingAngleHistUseCase } from './CreateSchedulingAngleHistUseCase';

class CreateSchedulingAngleHistController {
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
      timestamp
    } = req.body;
    
    const createSchedulingAngleHistUseCase = container.resolve(
      CreateSchedulingAngleHistUseCase
    );

    try {
      const allSchedulingAngleHist = await createSchedulingAngleHistUseCase.execute({
        pivot_id,
        is_return,
        author,
        power,
        water,
        direction,
        percentimeter,
        start_angle,
        end_angle,
        timestamp
      });
      
      res.send(allSchedulingAngleHist);
    } catch (err) {
      console.log(
        `[ERROR] Server 500 on /schedulingAngle/CreateSchedulingAngleHist`,
      );
      console.log(err);
      next(err);
    }
  }
}

export { CreateSchedulingAngleHistController };
