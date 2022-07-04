import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { DeleteSchedulingUseCase } from './DeleteSchedulingUseCase';
import { ParamsNotExpected } from '@root/protocols/errors';
import { checkReqData } from '@root/utils/decorators/check-types';

class DeleteSchedulingController {
  @checkReqData(0)
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const deleteSchedulingUseCase = container.resolve(DeleteSchedulingUseCase);

    try {
      const allSchedulingsFromPivots = await deleteSchedulingUseCase.execute({
        scheduling_id: id
      });

      res.sendStatus(200).send(allSchedulingsFromPivots);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        DeleteSchedulingController.name,
        'Delete Scheduling'
      );
      res.status(400).send({ error: err.message });
    }
  }
}

export { DeleteSchedulingController };
