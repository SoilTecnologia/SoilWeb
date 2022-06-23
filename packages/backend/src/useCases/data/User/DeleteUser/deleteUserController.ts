import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { DeleteUserUseCase } from './deleteUserUseCase';
import { ParamsNotExpected } from '@root/protocols/errors';

class DeleteUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (Object.keys(req.body).length > 0) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      try {
        const deleteUserUseCase = container.resolve(DeleteUserUseCase);

        const notUser = await deleteUserUseCase.execute({ user_id: id });
        return res.status(201).send(notUser);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          DeleteUserController.name,
          'Delete User'
        );
        res.status(400).send({ error: err.message });
      }
    }
  }
}

export { DeleteUserController };
