import { inject, injectable } from "tsyringe";
import { PumpModel } from "../../../database/model/Pump";
import { PumpRepository } from "../../../database/repositories/Pump/PumpRepository";
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
    class CreatePumpUseCase{
        constructor(
            @inject('PumpRepository')
            private pumpRepository: PumpRepository
        ){}

    
        private async applyQueryCreate(pump: PumpModel) {
            try {
              return await this.pumpRepository.create(pump);
            } catch (err) {
              messageErrorTryAction(
                err,
                true,
                CreatePumpUseCase.name,
                'CreatePump'
              );
            }
          }

        async execute(pump: Omit<PumpModel, 'pump_id'>){
            const {
                pivot_id,
                pump_power,
                startpump_angle,
                endpump_angle

            } = pump

        const pumpModel = new PumpModel();

        Object.assign(pumpModel, {
            pivot_id,
            pump_power,
            startpump_angle,
            endpump_angle
        });

        return await this.applyQueryCreate(pumpModel);
        }
    }

    export { CreatePumpUseCase }
