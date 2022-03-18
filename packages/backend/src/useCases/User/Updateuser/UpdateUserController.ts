import { NextFunction, Request, Response } from 'express';
import { UpdateUserUseCase } from './UpdateUserUseCase';

class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type, user_id } = request.body;

    try {
      const result = await this.updateUserUseCase.execute({
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
