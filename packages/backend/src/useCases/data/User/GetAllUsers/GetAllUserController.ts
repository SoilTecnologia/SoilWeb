import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { GetAllUserUseCase } from './GetAllUserUseCase';

class GetAllUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const getAllUserUseCase = container.resolve(GetAllUserUseCase);
      try {
        const usersList = await getAllUserUseCase.execute();
        return res.status(201).send(usersList);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          GetAllUserController.name,
          'Get All Users'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { GetAllUserController };
