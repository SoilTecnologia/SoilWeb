import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllSchedulingHistoryUseCase } from './GetAllSchedulingHistoryUseCase';

class GetAllSchedulingHistoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
      const getAllSchedulingHistoryUseCase = container.resolve(GetAllSchedulingHistoryUseCase);
      try {
        const allSchedulingHistory = await getAllSchedulingHistoryUseCase.execute();
  
        res.status(201).send(allSchedulingHistory);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /schedulinghistory/GetAllScheduleHistory`);
        console.log(err);
        next(err);
      }
    }
  }
  
  export { GetAllSchedulingHistoryController };