import { PivotModel } from "../../model/Pivot";
import { SchedulingModel } from "../../model/Scheduling";


interface ISchedulingRepository{
    findByPivotId(
        pivot_id: PivotModel['pivot_id']
    ) : Promise<SchedulingModel | undefined>;

    findById(scheduling_id: SchedulingModel['scheduling_id']) : Promise<SchedulingModel | undefined>

    create(scheduling: Omit<SchedulingModel, 'scheduling_id'>) : Promise<SchedulingModel | undefined>

    delete(scheduling_id: SchedulingModel['scheduling_id']) : Promise<SchedulingModel | undefined>

    update(scheduling: SchedulingModel) : Promise<SchedulingModel | undefined>

    
}

export { ISchedulingRepository }
