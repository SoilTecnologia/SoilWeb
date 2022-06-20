import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetFarmByUserUseCase } from './GetFarmByUserUseCase';

class GetFarmsByUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const getFarmByUserUseCase = container.resolve(GetFarmByUserUseCase);

    try {
      const allFarmsFromUser = await getFarmByUserUseCase.execute(id);

      res.status(201).send(allFarmsFromUser);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /farms/readAll`);
      console.log(err);
      next();
    }
  }
}

export { GetFarmsByUserController };
