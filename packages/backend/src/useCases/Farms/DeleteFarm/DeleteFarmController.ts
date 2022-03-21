import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteFarmUseCase } from './DeleteFarmUseCase';

class DeleteFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteFarmUseCase = container.resolve(DeleteFarmUseCase);

    try {
      const deletedFarm = await deleteFarmUseCase.execute(id);

      res.sendStatus(200).send(deletedFarm);
    } catch (err) {
      console.log('[ERROR] 500 Internal server error');
      console.log(err);
      next(err);
    }
  }
}

export { DeleteFarmController };
