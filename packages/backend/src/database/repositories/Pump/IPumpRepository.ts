import { PivotModel } from "../../model/Pivot";
import { PumpModel } from "../../model/Pump";

interface IPumpRepository{
    findByPivotId(
        pivot_id: PivotModel['pivot_id']
    ) : Promise<PumpModel[]>;

    findById(pump_id: PumpModel['pump_id']) : Promise<PumpModel | undefined>

    getAllPump() : Promise<PumpModel[]>

    create(pump: Omit<PumpModel, 'pump_id'>) : Promise<PumpModel | undefined>

    delete(pump: PumpModel['pump_id']) : Promise<PumpModel | undefined>

    update(pump: PumpModel) : Promise<PumpModel | undefined>

}

export { IPumpRepository }