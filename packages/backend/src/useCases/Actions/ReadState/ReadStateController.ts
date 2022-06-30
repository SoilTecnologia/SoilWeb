import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { ReadStateUseCase } from './ReadStateUseCase';
class ReadStateController {
  async handle(req: Request, res: Response) {
    const { pivots } = req.body;

    try {
      const readState = container.resolve(ReadStateUseCase);

      const response = await readState.execute({ pivots });

      res.status(201).send({ response });
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        ReadStateController.name,
        'Read State Att'
      );

      res.status(400).send({ error: err.message });
    }
  }
}

export { ReadStateController };
