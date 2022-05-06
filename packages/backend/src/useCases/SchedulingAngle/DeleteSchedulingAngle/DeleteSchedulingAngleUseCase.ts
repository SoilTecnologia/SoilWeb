import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';

@injectable()
class DeleteSchedulingAngleUseCase{
    constructor(
        @inject('SchedulingAngleRepository') private schedulingangleRepository : ISchedulingAngleRepository
    ) {}


async execute (schedulingangle_id: SchedulingAngleModel['schedulingangle_id']){
    const schedulingangle = await this.schedulingangleRepository.findById(schedulingangle_id);
    
    if (schedulingangle){
        const schedulingangle = await this.schedulingangleRepository.delete(schedulingangle_id);

        return schedulingangle;
    }

    throw new Error('Scheduling does not exist')
}
}

export { DeleteSchedulingAngleUseCase }