import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';

@injectable()
class UpdateSchedulingUseCase{
    constructor(
        @inject('SchedulingRepository') private schedulingRepository: ISchedulingRepository
        ) {}

        async execute (scheduling: SchedulingModel){
            const getScheduling = await this.schedulingRepository.findById(scheduling.scheduling_id);
            

            if(getScheduling){
                const newScheduling = await this.schedulingRepository.update(scheduling);
                
                return newScheduling;
            }
            throw new Error('Schedulings Does Not Exists');
        }

}

export { UpdateSchedulingUseCase }