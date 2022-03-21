import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteUserUseCase } from './deleteUserUseCase';

class DeleteUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const deleteUserUseCase = container.resolve(DeleteUserUseCase);
    try {
      const notUser = await deleteUserUseCase.execute(id);
      res.sendStatus(200).send(notUser);
    } catch (err) {
      console.log(`[ERROR] 500 on /users/deleteUser`);
      console.log(err);
      next(err);
    }
  }
}

export { DeleteUserController };
