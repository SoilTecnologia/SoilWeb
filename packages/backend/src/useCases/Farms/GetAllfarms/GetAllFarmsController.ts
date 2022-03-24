import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllFarmsUseCase } from './GetAllFarmsUseCase';

class GetAllFarmsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const getAllFarmsUseCase = container.resolve(GetAllFarmsUseCase);
    try {
      const allFarmsFromUser = await getAllFarmsUseCase.execute();

      res.status(201).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetAllFarmsController };
