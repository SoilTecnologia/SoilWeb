import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetOneFarmUseCase } from './GetOneFarmsuseCase';

class GetOneFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farmId } = req.params;

    const getOneFarmUseCase = container.resolve(GetOneFarmUseCase);

    try {
      const allFarmsFromUser = await getOneFarmUseCase.execute(farmId);

      res.status(200).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetOneFarmController };
