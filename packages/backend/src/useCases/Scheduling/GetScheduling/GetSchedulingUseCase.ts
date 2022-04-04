import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';

@injectable()
class GetSchedulingUseCase{
    constructor(
        @inject('SchedulingRepository') private schedulingRepository: ISchedulingRepository
    ) {}

    async execute (pivot_id: PivotModel['pivot_id']){
        const getScheduling = await this.schedulingRepository.findByPivotId(pivot_id);

        return getScheduling;
    }
}

export { GetSchedulingUseCase }