import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { GetAllUserUseCase } from './GetAllUserUseCase';

class GetAllUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const getAllUserUseCase = container.resolve(GetAllUserUseCase);
    try {
      const usersList = await getAllUserUseCase.execute();
      res.status(200).send(usersList);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        GetAllUserController.name,
        'Get All Users'
      );
      next();
    }
  }
}

export { GetAllUserController };
