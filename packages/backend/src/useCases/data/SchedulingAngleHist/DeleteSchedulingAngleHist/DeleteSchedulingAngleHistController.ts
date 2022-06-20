import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteSchedulingAngleHistUseCase } from './DeleteSchedulingAngleHistUseCase';

class DeleteSchedulingAngleHistController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deleteSchedulingAngleHistUseCase = container.resolve(DeleteSchedulingAngleHistUseCase);
        
        try{
            const allSchedulingsAngleHistFromPivots = await deleteSchedulingAngleHistUseCase.execute(id);
            
            res.sendStatus(200).send(allSchedulingsAngleHistFromPivots)
        } catch(err) {
            console.log(`[ERROR] Server 500 on /schedulingsangleHist/readAll`)
            console.log(err);
            next(err);
        }
    }
}

export { DeleteSchedulingAngleHistController }