import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { messageErrorTryAction } from '../../../utils/types';
import { CreatePumpUseCase } from './CreatePumpUseCase';

class CreatePumpController{
    async handle (req: Request, res: Response, next: NextFunction) {
     const {
        pivot_id,
        pump_power,
        startpump_angle,
        endpump_angle
     } = req.body

     const createPumpUseCase = container.resolve(CreatePumpUseCase)

     try {
         const allPump = await createPumpUseCase.execute({
            pivot_id,
            pump_power,
            startpump_angle,
            endpump_angle
         });

         res.send(allPump)
     } catch(err){
         messageErrorTryAction(
             err,
             false,
             CreatePumpController.name,
             'CreatePump'
         );
         next(err)
     }
   }
}

export { CreatePumpController }