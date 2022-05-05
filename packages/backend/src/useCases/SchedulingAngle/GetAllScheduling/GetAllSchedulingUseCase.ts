import { inject, injectable } from 'tsyringe';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';

@injectable()
class GetAllSchedulingUseCase{
    constructor(
        @inject('SchedulingRepository') private schedulingRepository: ISchedulingRepository
    ) {}

    async execute() {
        const AllSchedulings = await this.schedulingRepository.getAllSchedulings();
    
        if (AllSchedulings && AllSchedulings.length > 0) return AllSchedulings;
    
        throw new Error('Does not exists Schedule');
      }
}


export { GetAllSchedulingUseCase }