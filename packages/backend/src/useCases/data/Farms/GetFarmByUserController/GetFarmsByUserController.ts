import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetFarmByUserUseCase } from './GetFarmByUserUseCase';

class GetFarmsByUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getFarmByUserUseCase = container.resolve(GetFarmByUserUseCase);

      try {
        const allFarmsFromUser = await getFarmByUserUseCase.execute({
          user_id: id
        });

        return res.status(201).send(allFarmsFromUser);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /farms/readAll`);
        console.log(err);
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetFarmsByUserController };
