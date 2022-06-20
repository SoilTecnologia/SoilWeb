import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetSchedulingAngleUseCase } from './GetSchedulingAngleUseCase';

class GetSchedulingAngleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getSchedulingAngleUseCase = container.resolve(GetSchedulingAngleUseCase);

        try {
            const allSchedulingAnglefromPivot = await getSchedulingAngleUseCase.execute(id);

            res.status(200).send(allSchedulingAnglefromPivot);
        } catch (err) {
            console.log('[ERROR] Server 500 on /schedulingangle/getSchedulingAngle');
            console.log(err);
            next(err);
        }
    }

}

export { GetSchedulingAngleController }