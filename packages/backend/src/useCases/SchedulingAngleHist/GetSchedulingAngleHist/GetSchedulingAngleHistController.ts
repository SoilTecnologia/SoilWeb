import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetSchedulingAngleHistUseCase } from './GetSchedulingAngleHistUseCase';

class GetSchedulingAngleHistController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getSchedulingAngleHistUseCase = container.resolve(GetSchedulingAngleHistUseCase);

        try {
            const allSchedulingAngleHistfromPivot = await getSchedulingAngleHistUseCase.execute(id);

            res.status(200).send(allSchedulingAngleHistfromPivot);
        } catch (err) {
            console.log('[ERROR] Server 500 on /schedulingangle/getSchedulingAngle');
            console.log(err);
            next(err);
        }
    }

}

export { GetSchedulingAngleHistController }