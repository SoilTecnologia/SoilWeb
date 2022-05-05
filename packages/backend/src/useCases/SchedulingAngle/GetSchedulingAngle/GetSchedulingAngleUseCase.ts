import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';

@injectable()
class GetSchedulingAngleUseCase{
    constructor(
        @inject('SchedulingAngleRepository') private schedulingAngleRepository: ISchedulingAngleRepository
    ) {}

    async execute (pivot_id: PivotModel['pivot_id']){
        const getSchedulingAngle = await this.schedulingAngleRepository.findByPivotId(pivot_id);

        return getSchedulingAngle;
    }
}

export { GetSchedulingAngleUseCase }