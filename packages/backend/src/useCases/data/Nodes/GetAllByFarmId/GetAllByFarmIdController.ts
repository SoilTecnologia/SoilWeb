import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllByFarmIdUseCase } from './GetAllByFarmIdUseCase';

class GetAllByFarmIdController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farm_id } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getAllByFarmsIdUseCase = container.resolve(GetAllByFarmIdUseCase);

      try {
        const allNodesFromFarm = await getAllByFarmsIdUseCase.execute({
          farm_id
        });

        res.status(201).send(allNodesFromFarm);
      } catch (err) {
        console.log(`[ERROR] Server 500 on /nodes/readAll`);
        console.log(err);
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetAllByFarmIdController };
