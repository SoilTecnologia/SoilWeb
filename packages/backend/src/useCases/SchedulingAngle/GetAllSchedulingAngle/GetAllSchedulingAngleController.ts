import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllSchedulingAngleUseCase } from './GetAllSchedulingAngleUseCase';

class GetAllSchedulingAngleController {
    async handle(req: Request, res: Response, next: NextFunction) {
      const getAllSchedulingsAngleUseCase = container.resolve(GetAllSchedulingAngleUseCase);
      try {
        const allSchedulingAngle = await getAllSchedulingsAngleUseCase.execute();
  
        res.status(200).send(allSchedulingAngle);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /scheduling/GetAllSchedule`);
        console.log(err);
        next(err);
      }
    }
  }
  
  export { GetAllSchedulingAngleController };