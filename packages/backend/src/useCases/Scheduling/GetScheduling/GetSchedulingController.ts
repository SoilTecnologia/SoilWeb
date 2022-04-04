import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetSchedulingUseCase } from './GetSchedulingUseCase';

class GetSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getSchedulingUseCase = container.resolve(GetSchedulingUseCase);

        try {
            const allSchedulingfromPivot = await getSchedulingUseCase.execute(id);

            res.status(200).send(allSchedulingfromPivot);
        } catch (err) {
            console.log('[ERROR] Server 500 on /scheduling/getScheduling');
            console.log(err);
            next(err);
        }
    }

}

export { GetSchedulingController }