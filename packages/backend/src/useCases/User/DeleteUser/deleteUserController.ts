import { NextFunction, Request, Response } from 'express';
import { DeleteUserUseCase } from './deleteUserUseCase';

class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const notUser = await this.deleteUserUseCase.execute(id);
      res.sendStatus(200).send(notUser);
    } catch (err) {
      console.log(`[ERROR] 500 on /users/deleteUser`);
      console.log(err);
      next(err);
    }
  }
}

export { DeleteUserController };
