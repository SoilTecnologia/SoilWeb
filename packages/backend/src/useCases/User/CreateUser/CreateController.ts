import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    try {
      const result = await createUserUseCase.execute({
        login,
        password,
        user_type
      });

      return response.status(201).send(result);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /users/signup:`);
      console.log(err);
      next(err);
    }
  }
}

export { CreateUserController };
