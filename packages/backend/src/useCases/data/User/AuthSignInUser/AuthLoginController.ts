import { ParamsNotExpected } from '@root/protocols/errors';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '@utils/types';
import { AuthSignInUseCase } from './AuthLoginUseCase';

class AuthSignInController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { login, password } = req.body;

    if (Object.keys(req.body).length > 2) {
      res.status(400).send({ error: new ParamsNotExpected().message });
    } else {
      const authSignInUseCase = container.resolve(AuthSignInUseCase);

      try {
        const cookieInfo = await authSignInUseCase.execute({ login, password });

        res.status(201).send(cookieInfo);
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          AuthSignInController.name,
          ` TRY LOGIN`
        );
        return res.status(400).send({ error: err.message });
      }
    }
  }
}

export { AuthSignInController };
