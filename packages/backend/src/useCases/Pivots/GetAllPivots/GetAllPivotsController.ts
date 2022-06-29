import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
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
        res.status(200).send('Id not identifier');
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetAllPivotsController.name,
        'Get All Pivots Of The Farms'
      );
      next();
    }
  }
}

export { GetAllPivotsController };
