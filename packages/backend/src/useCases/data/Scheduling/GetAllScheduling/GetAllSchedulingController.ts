import { checkReqData } from '@root/utils/decorators/check-types';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetAllSchedulingUseCase } from './GetAllSchedulingUseCase';

class GetAllSchedulingController {
  @checkReqData(0)
  async handle(req: Request, res: Response) {
    const getAllSchedulingsUseCase = container.resolve(GetAllSchedulingUseCase);
    try {
      const allScheduling = await getAllSchedulingsUseCase.execute();

      return res.status(201).send(allScheduling);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /scheduling/GetAllSchedule`);
      console.log(err);
      res.status(400).send({ error: err.message });
    }
  }
}

export { GetAllSchedulingController };
