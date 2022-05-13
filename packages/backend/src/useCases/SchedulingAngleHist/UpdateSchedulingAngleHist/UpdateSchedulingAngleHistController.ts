import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateSchedulingAngleHistUseCase } from './UpdateSchedulingAngleHistUseCase';

class UpdateSchedulingAngleHistController{
    async handle (req: Request, res: Response, next: NextFunction){
        const schedulingangle = req.body;
        const updateSchedulingAngleHistUseCase = container.resolve(UpdateSchedulingAngleHistUseCase);
        try {  
            const putSchedulingAngle = await updateSchedulingAngleHistUseCase.execute(schedulingangle);

            res.status(200).send(putSchedulingAngle);
        } catch(err){
            console.log('[ERROR] Internal Server error');
            console.log(err);
            next(err);
    }
    }
}

export { UpdateSchedulingAngleHistController }