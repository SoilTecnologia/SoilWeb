import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetAllFarmsUseCase } from './GetAllFarmsUseCase';

class GetAllFarmsController {
  async handle(req: Request, res: Response, next: NextFunction) {
    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getAllFarmsUseCase = container.resolve(GetAllFarmsUseCase);
      try {
        const allFarmsFromUser = await getAllFarmsUseCase.execute();

        return res.status(201).send(allFarmsFromUser);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          GetAllFarmsController.name,
          'Get All Farms'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetAllFarmsController };
