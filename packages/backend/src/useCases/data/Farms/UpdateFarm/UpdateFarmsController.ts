import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { UpdateFarmUseCase } from './UpdateFarmUseCase';
import { FarmModel } from '@root/database/model/Farm';
import { ParamsNotExpected } from '@root/protocols/errors';

class UpdateFarmController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      farm_id,
      farm_city,
      farm_lat,
      farm_lng,
      farm_name,
      user_id
    }: FarmModel = req.body;

    if (Object.keys(req.body).length > 6) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const updateFarmUseCase = container.resolve(UpdateFarmUseCase);
      try {
        const putFarm = await updateFarmUseCase.execute({
          farm_id,
          user_id,
          farm_city,
          farm_lat,
          farm_lng,
          farm_name
        });

        res.status(200).send(putFarm);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          UpdateFarmController.name,
          'Update Farm'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { UpdateFarmController };
