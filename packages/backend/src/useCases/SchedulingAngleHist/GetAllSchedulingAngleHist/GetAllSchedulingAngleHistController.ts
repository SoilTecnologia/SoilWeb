import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllSchedulingAngleHistUseCase } from './GetAllSchedulingAngleHistUseCase';

class GetAllSchedulingAngleHistController {
    async handle(req: Request, res: Response, next: NextFunction) {
      const getAllSchedulingsAngleHistUseCase = container.resolve(GetAllSchedulingAngleHistUseCase);
      try {
        const allSchedulingAngleHist = await getAllSchedulingsAngleHistUseCase.execute();
  
        res.status(200).send(allSchedulingAngleHist);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /schedulingHist/GetAllSchedule`);
        console.log(err);
        next(err);
      }
    }
  }
  
  export { GetAllSchedulingAngleHistController };