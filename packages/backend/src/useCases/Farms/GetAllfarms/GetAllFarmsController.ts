import { NextFunction, Request, Response } from 'express';
import { GetAllFarmsUseCase } from './GetAllFarmsUseCase';

class GetAllFarmsController {
  constructor(private getAllFarmsUseCase: GetAllFarmsUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const allFarmsFromUser = await this.getAllFarmsUseCase.execute();

      res.status(201).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetAllFarmsController };
