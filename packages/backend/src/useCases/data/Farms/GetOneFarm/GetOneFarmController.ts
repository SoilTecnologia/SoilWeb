import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetOneFarmUseCase } from './GetOneFarmsuseCase';
import { ParamsInvalid, ParamsNotExpected } from '@root/protocols/errors';

class GetOneFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { farmId } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getOneFarmUseCase = container.resolve(GetOneFarmUseCase);

      try {
        const allFarmsFromUser = await getOneFarmUseCase.execute({
          farm_id: farmId
        });

        return res.status(200).send(allFarmsFromUser);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          GetOneFarmController.name,
          'Get One Farm'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetOneFarmController };
