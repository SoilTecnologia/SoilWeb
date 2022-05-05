import { PivotModel } from "../../model/Pivot";
import { SchedulingAngleModel } from "../../model/SchedulingAngle";


interface ISchedulingAngleRepository{
    findByPivotId(
        pivot_id: PivotModel['pivot_id']
    ) : Promise<SchedulingAngleModel[]>;

    findById(schedulingangle_id: SchedulingAngleModel['schedulingangle_id']) : Promise<SchedulingAngleModel | undefined>

    getAllSchedulingsAngle(): Promise<SchedulingAngleModel[]>;

    create(schedulingangle: Omit<SchedulingAngleModel, 'schedulingangle_id'>) : Promise<SchedulingAngleModel | undefined>

    delete(schedulingangle_id: SchedulingAngleModel['schedulingangle_id']) : Promise<SchedulingAngleModel | undefined>

    update(schedulingangle: SchedulingAngleModel) : Promise<SchedulingAngleModel | undefined>

    
}

export { ISchedulingAngleRepository }
