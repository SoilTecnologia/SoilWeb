import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';

@injectable()
class GetSchedulingAngleHistUseCase{
    constructor(
        @inject('SchedulingAngleHistRepository') private schedulingAngleHistRepository: ISchedulingAngleHistRepository
    ) {}

    async execute (pivot_id: PivotModel['pivot_id']){
        const getSchedulingAngleHist = await this.schedulingAngleHistRepository.findByPivotId(pivot_id);

        return getSchedulingAngleHist;
    }
}

export { GetSchedulingAngleHistUseCase }