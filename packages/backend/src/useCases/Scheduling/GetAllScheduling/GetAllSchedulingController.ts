import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllSchedulingUseCase } from './GetAllSchedulingUseCase';

class GetAllSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction) {
      const getAllSchedulingsUseCase = container.resolve(GetAllSchedulingUseCase);
      try {
        const allScheduling = await getAllSchedulingsUseCase.execute();
  
        res.status(201).send(allScheduling);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /scheduling/GetAllSchedule`);
        console.log(err);
        next(err);
      }
    }
  }
  
  export { GetAllSchedulingController };