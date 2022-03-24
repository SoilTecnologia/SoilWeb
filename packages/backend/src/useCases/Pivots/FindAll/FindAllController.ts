import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindAllUseCase } from './FindAllUseCase';

class FindAllController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const findAlluseCase = container.resolve(FindAllUseCase);

    try {
      const pivots = await findAlluseCase.execute();
      res.status(200).send(pivots);
    } catch (err) {
      console.log('[ERROR] Internal Server Error');
      console.log(err);
      next(err);
    }
  }
}

export { FindAllController };
