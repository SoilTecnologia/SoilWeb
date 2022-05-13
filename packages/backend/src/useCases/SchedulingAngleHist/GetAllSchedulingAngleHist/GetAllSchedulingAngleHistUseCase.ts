import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';

@injectable()
class GetAllSchedulingAngleHistUseCase{
    constructor(
        @inject('SchedulingAngleHistRepository') private schedulingAngleHistRepository :ISchedulingAngleHistRepository 

    ) {}

    async execute() {
        const AllSchedulingsAngleHist = await this.schedulingAngleHistRepository.getAllSchedulingsAngle();
    
        if (AllSchedulingsAngleHist && AllSchedulingsAngleHist.length > 0) return AllSchedulingsAngleHist;
    
        throw new Error('Does not exists Schedule Angle Hist');
      }
}


export { GetAllSchedulingAngleHistUseCase }