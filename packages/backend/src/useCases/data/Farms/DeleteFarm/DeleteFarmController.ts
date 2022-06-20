import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { DeleteFarmUseCase } from './DeleteFarmUseCase';

class DeleteFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteFarmUseCase = container.resolve(DeleteFarmUseCase);

    try {
      const deletedFarm = await deleteFarmUseCase.execute(id);

      res.sendStatus(200).send(deletedFarm);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteFarmController.name,
        'Delete Farm'
      );
      next();
    }
  }
}

export { DeleteFarmController };
