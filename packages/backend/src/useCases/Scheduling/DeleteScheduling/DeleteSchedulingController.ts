import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteSchedulingUseCase } from './DeleteSchedulingUseCase';

class DeleteSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deleteSchedulingUseCase = container.resolve(DeleteSchedulingUseCase);
        
        try{
            const allSchedulingsFromPivots = await deleteSchedulingUseCase.execute(id);
            
            res.sendStatus(200).send(allSchedulingsFromPivots)
        } catch(err) {
            console.log(`[ERROR] Server 500 on /schedulings/readAll`)
            console.log(err);
            next(err);
        }
    }
}

export { DeleteSchedulingController }