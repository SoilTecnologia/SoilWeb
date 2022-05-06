import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateSchedulingAngleUseCase } from './UpdateSchedulingAngleUseCase';

class UpdateSchedulingAngleController{
    async handle (req: Request, res: Response, next: NextFunction){
        const schedulingangle = req.body;
        const updateSchedulingAngleUseCase = container.resolve(UpdateSchedulingAngleUseCase);
        try {  
            const putSchedulingAngle = await updateSchedulingAngleUseCase.execute(schedulingangle);

            res.status(200).send(putSchedulingAngle);
        } catch(err){
            console.log('[ERROR] Internal Server error');
            console.log(err);
            next(err);
    }
    }
}

export { UpdateSchedulingAngleController }