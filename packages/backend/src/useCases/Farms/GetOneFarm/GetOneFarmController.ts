import { NextFunction, Request, Response } from 'express';
import { GetOneFarmUseCase } from './GetOneFarmsuseCase';

class GetOneFarmController {
  constructor(private getOneFarmUseCase: GetOneFarmUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { farmId } = req.params;

    try {
      const allFarmsFromUser = await this.getOneFarmUseCase.execute(farmId);

      res.status(200).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetOneFarmController };
