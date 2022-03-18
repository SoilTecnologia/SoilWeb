import { NextFunction, Request, Response } from 'express';
import { DeleteFarmUseCase } from './DeleteFarmUseCase';

class DeleteFarmController {
  constructor(private deleteFarmUseCase: DeleteFarmUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const deletedFarm = await this.deleteFarmUseCase.execute(id);

      res.sendStatus(200).send(deletedFarm);
    } catch (err) {
      console.log('[ERROR] 500 Internal server error');
      console.log(err);
      next(err);
    }
  }
}

export { DeleteFarmController };
