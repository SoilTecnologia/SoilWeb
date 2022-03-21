import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeletePivotUseCase } from './DeletePivotUseCase';

class DeletePivotController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deletePivotUseCase = container.resolve(DeletePivotUseCase);

    try {
      const allPivotsFromNode = await deletePivotUseCase.execute(id);

      res.send(allPivotsFromNode);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /pivots/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { DeletePivotController };
