import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateUserUseCase } from './UpdateUserUseCase';

class UpdateUserController {
  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type, user_id } = request.body;
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
      console.log(`[ERROR] Server 500 on /users/signup:`);
      console.log(err);
      next(err);
    }
  }
}

export { UpdateUserController };
