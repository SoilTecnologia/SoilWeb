import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { FarmModel } from '../../../../database/model/Farm';
import { messageErrorTryAction } from '../../../../utils/types';
import { CreateFarmUseCase } from './CreateFarmUseCase';

class CreateFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      farm_id,
      user_id,
      farm_name,
      farm_city,
      farm_lng,
      farm_lat
    }: FarmModel = req.body;

    if (Object.keys(req.body).length > 6) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const createFarmUseCase = container.resolve(CreateFarmUseCase);

      try {
        const farm = await createFarmUseCase.execute({
          farm_id,
          user_id,
          farm_name,
          farm_city,
          farm_lng,
          farm_lat
        });
        res.status(201).send(farm);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          CreateFarmController.name,
          'Create Farm'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { CreateFarmController };
