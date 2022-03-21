import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { ReadAllUseCase } from './ReadAllUseCase';

class ReadAllController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    const realdAllUseCase = container.resolve(ReadAllUseCase);

    try {
      const allPivotsFromNode = await realdAllUseCase.execute(farm_id);

      res.send(allPivotsFromNode);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { ReadAllController };
