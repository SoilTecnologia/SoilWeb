import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../../utils/types';
import { CreateActionUseCase } from './CreateActionUseCase';

export interface IUserAuthInfoRequest extends Request {
  user: {
    user_id: string;
    user_type: string;
  }; // or any other type
}

class CreateActionController {
  async handle(req: IUserAuthInfoRequest, res: Response, next: NextFunction) {
    const { pivot_id } = req.params;
    const { power, water, direction, percentimeter } = req.body;

    const createActionUseCase = container.resolve(CreateActionUseCase);
    const newActionCreated = {
      pivot_id,
      author: req.user.user_id,
      power,
      water,
      direction,
      percentimeter
    };

    try {
      const newAction = await createActionUseCase.execute(
        newActionCreated,
        null,
        false
      );

      res.json(newAction);
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CreateActionController.name,
        'Create Action'
      );
      next();
    }
  }
}

export { CreateActionController };
