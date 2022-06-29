import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { messageErrorTryAction } from "../../../utils/types";
import { GetAllPumpUseCase } from "./GetAllPumpUseCase";

class GetAllPumpController {
    async handle(req: Request, res: Response, next: NextFunction){
        const getAllPumpController = container.resolve(GetAllPumpUseCase);
        try {
            const allPumpController = await getAllPumpController.execute();

            res.status(200).send(allPumpController);

        }catch (err){
            messageErrorTryAction(
                err,
                false,
                GetAllPumpController.name,
                'Get All Pumps'
            );
            next();
        }
    }

}
export { GetAllPumpController }