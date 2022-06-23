import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { DeleteFarmUseCase } from './DeleteFarmUseCase';
import { ParamsNotExpected } from '@root/protocols/errors';

class DeleteFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const deleteFarmUseCase = container.resolve(DeleteFarmUseCase);

      try {
        const deletedFarm = await deleteFarmUseCase.execute({ farm_id: id });

        return res.status(201).send(deletedFarm);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          DeleteFarmController.name,
          'Delete Farm'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { DeleteFarmController };
