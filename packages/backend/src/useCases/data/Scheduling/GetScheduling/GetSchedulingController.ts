import { checkReqData } from '@root/utils/decorators/check-types';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { GetSchedulingUseCase } from './GetSchedulingUseCase';

class GetSchedulingController {
  @checkReqData(0)
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const getSchedulingUseCase = container.resolve(GetSchedulingUseCase);

    try {
      const allSchedulingfromPivot = await getSchedulingUseCase.execute({
        pivot_id: id
      });
      return res.status(200).send(allSchedulingfromPivot);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetSchedulingController.name,
        'Get Schedulling By Pivot Id'
      );
      res.status(400).send({ error: err.message });
    }
  }
}

export { GetSchedulingController };
