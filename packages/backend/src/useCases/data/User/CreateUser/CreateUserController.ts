import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type } = request.body;

    if (Object.keys(request.body).length > 3) {
      response.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const createUserUseCase = container.resolve(CreateUserUseCase);

      try {
        const result = await createUserUseCase.execute({
          login,
          password,
          user_type
        });

        return response.status(201).send(result);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          CreateUserController.name,
          'TRY CREATE USER'
        );

        response.status(400).send({ error: err.message });
      }
    }
  }
}

export { CreateUserController };
