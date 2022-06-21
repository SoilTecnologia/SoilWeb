import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { UpdateUserUseCase } from './UpdateUserUseCase';

class UpdateUserController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type, user_id } = request.body;

    if (Object.keys(request.body).length > 4) {
      response.status(400).send({ error: 'Received Params not expected' });
    } else {
      const updateUserUseCase = container.resolve(UpdateUserUseCase);

      try {
        const result = await updateUserUseCase.execute({
          login,
          password,
          user_type,
          user_id
        });

        return response.status(201).send(result);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          UpdateUserController.name,
          'Update User'
        );
        response.status(400).send({ error: err.message });
      }
    }
  }
}

export { UpdateUserController };
