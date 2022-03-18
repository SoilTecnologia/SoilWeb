import { NextFunction, Request, Response } from 'express';
import { AuthSignInUseCase } from './AuthLoginUseCase';

class AuthSignInController {
  constructor(private authSignInUseCase: AuthSignInUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { login, password } = req.body;

    try {
      const cookieInfo = await this.authSignInUseCase.execute(login, password);

      res.status(200).send(cookieInfo);
    } catch (err) {
      console.log(`[ERROR] Server 500 on /users/signin:`);
      console.log(err);
      next(err);
    }
  }
}

export { AuthSignInController };
