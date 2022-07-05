import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { UpdateSchedulingUseCase } from './UpdateSchedulingUseCase';
import { checkReqData } from '@root/utils/decorators/check-types';

class UpdateSchedulingController {
  @checkReqData(11)
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      scheduling_id,
      pivot_id,
      author,
      is_stop,
      power,
      water,
      direction,
      percentimeter,
      update_timestamp,
      start_timestamp,
      end_timestamp
    } = req.body;
    const updateSchedulingUseCase = container.resolve(UpdateSchedulingUseCase);
    try {
      const putScheduling = await updateSchedulingUseCase.execute({
        scheduling_id,
        pivot_id,
        author,
        is_stop,
        power,
        water,
        direction,
        percentimeter,
        start_timestamp,
        end_timestamp,
        update_timestamp
      });

      return res.status(201).send(putScheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingController.name,
        'Update Scheduling'
      );
      res.status(400).send({ error: err.message });
    }
  }
}

export { UpdateSchedulingController };
