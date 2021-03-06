import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { AuthSignInUseCase } from './AuthLoginUseCase';

class AuthSignInController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { login, password } = req.body;
    const authSignInUseCase = container.resolve(AuthSignInUseCase);

    try {
      const cookieInfo = await authSignInUseCase.execute(login, password);

      res.status(200).send(cookieInfo);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /users/signin:`);
      console.log(err);
      next(err);
    }
  }
}

export { AuthSignInController };
