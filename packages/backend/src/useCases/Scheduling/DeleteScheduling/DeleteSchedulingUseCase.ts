import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';

@injectable()
class DeleteSchedulingUseCase{
    constructor(
        @inject('SchedulingRepository') private schedulingRepository : ISchedulingRepository
    ) {}


async execute (scheduling_id: SchedulingModel['scheduling_id']){
    const scheduling = await this.schedulingRepository.findById(scheduling_id);
    
    if (scheduling){
        const scheduling = await this.schedulingRepository.delete(scheduling_id);

        return scheduling;
    }

    throw new Error('Scheduling does not exist')
}
}

export { DeleteSchedulingUseCase }