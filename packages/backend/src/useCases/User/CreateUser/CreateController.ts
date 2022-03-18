import { NextFunction, Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    const { login, password, user_type } = request.body;

    try {
      const result = await this.createUserUseCase.execute({
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
