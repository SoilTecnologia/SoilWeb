import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteSchedulingAngleUseCase } from './DeleteSchedulingAngleUseCase';

class DeleteSchedulingAngleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deleteSchedulingAngleUseCase = container.resolve(DeleteSchedulingAngleUseCase);
        
        try{
            const allSchedulingsAngleFromPivots = await deleteSchedulingAngleUseCase.execute(id);
            
            res.sendStatus(200).send(allSchedulingsAngleFromPivots)
        } catch(err) {
            console.log(`[ERROR] Server 500 on /schedulings/readAll`)
            console.log(err);
            next(err);
        }
    }
}

export { DeleteSchedulingAngleController }