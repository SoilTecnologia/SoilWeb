import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { SchedulingRepository } from '../../../database/repositories/Scheduling/SchedulingRepository'

@injectable()
class CreateSchedulingUseCase {
    constructor(
        @inject('SchedulingRepository') private schedulingRepository: SchedulingRepository
    ) {}

    async execute(scheduling: Omit<SchedulingModel, 'scheduling_id'>){
        const{
            pivot_id,
            power,
            water,
            direction,
            percentimeter,
            start_timestamp,
            end_timestamp,
            timestamp

        } = scheduling;

        const schedulingModel = new SchedulingModel();

        Object.assign(schedulingModel,{
            pivot_id,
            power,
            water,
            direction,
            percentimeter,
            start_timestamp,
            end_timestamp,
            timestamp
        });

        const newSchedulingData = await this.schedulingRepository.create(schedulingModel);

        return newSchedulingData;
    }
}

export { CreateSchedulingUseCase }