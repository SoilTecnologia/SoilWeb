import { inject, injectable } from "tsyringe";
import { IPumpRepository } from "../../../database/repositories/Pump/IPumpRepository";
import { messageErrorTryAction } from "../../../utils/types";

@injectable()
class GetAllPumpUseCase{
    constructor(
        @inject('PumpRepository') private pumpRepository: IPumpRepository
    ) {}

    private async applyQueryGetAll(){
        try{
            return await this.pumpRepository.getAllPump();
        }catch (err) {
            messageErrorTryAction(
                err,
                true,
                GetAllPumpUseCase.name,
                'Get All Pumps'
            );
        }
    }

    async execute (){
        const pumps = await this.applyQueryGetAll();

        if(pumps) return pumps;

        throw new Error('Does not exists Pumps')
    }

}
export { GetAllPumpUseCase };