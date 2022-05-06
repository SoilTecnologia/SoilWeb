import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { DeletePumpUseCase } from './DeletePumpUseCase';

class DeletePumpController{
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deletePumpUseCase = container.resolve(DeletePumpUseCase);
    

    try{
        const allPumpFromPivots = await deletePumpUseCase.execute(
            id
        );

        res.sendStatus(200).send(allPumpFromPivots);
    }catch (err){
        messageErrorTryAction(
            err,
            false,
            DeletePumpController.name,
            'Delete Pump'
          );
          next(err);
        }
    }
}

export { DeletePumpController }