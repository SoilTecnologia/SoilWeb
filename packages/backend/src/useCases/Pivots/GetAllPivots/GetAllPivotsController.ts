import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllPivotsUseCase } from './GetAllPivotsUseCase';

class GetAllPivotsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const getAllPivotUseCase = container.resolve(GetAllPivotsUseCase);
    try {
      if (id) {
        const allPivotsFromNode = await getAllPivotUseCase.execute(id);

        res.send(allPivotsFromNode);
      } else {
        res.status(201).send('Id not identifier');
      }
    } catch (err) {
      console.log(`[ERROR] Server 500 on pivots`);
      console.log(err);
      next(err);
    }
  }
}

export { GetAllPivotsController };
