import { NextFunction, Request, Response } from 'express';
import { GetAllUserUseCase } from './GetAllUserUseCase';

class GetAllUserController {
  constructor(private getAllUserUseCase: GetAllUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const usersList = await this.getAllUserUseCase.execute();
      res.status(200).send(usersList);
    } catch (err) {
      console.log('[ERROR] Error in the server');
      console.log(err);
      next(err);
    }
  }
}

export { GetAllUserController };
