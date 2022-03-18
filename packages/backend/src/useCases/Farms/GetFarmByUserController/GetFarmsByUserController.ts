import { NextFunction, Request, Response } from 'express';
import { GetFarmByUserUseCase } from './GetFarmByUserUseCase';

class GetFarmsByUserController {
  constructor(private getFarmByUserUseCase: GetFarmByUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const allFarmsFromUser = await this.getFarmByUserUseCase.execute(id);

      res.status(201).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next(err);
    }
  }
}

export { GetFarmsByUserController };
