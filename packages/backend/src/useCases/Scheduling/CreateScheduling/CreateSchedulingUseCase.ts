import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { SchedulingRepository } from '../../../database/repositories/Scheduling/SchedulingRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: SchedulingRepository
  ) {}
  private async applyQueryCreate(scheduling: SchedulingModel) {
    try {
      return await this.schedulingRepository.create(scheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateSchedulingUseCase.name,
        'CreateSchedulling'
      );
    }
  }
  async execute(scheduling: Omit<SchedulingModel, 'scheduling_id'>) {
    const {
      pivot_id,
      power,
      water,
      direction,
      start_angle,
      end_angle,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    } = scheduling;

    const schedulingModel = new SchedulingModel();

    Object.assign(schedulingModel, {
      pivot_id,
      power,
      water,
      direction,
      start_angle,
      end_angle,
      percentimeter,
      start_timestamp,
      end_timestamp,
      timestamp
    });

    return await this.applyQueryCreate(schedulingModel);
  }
}

export { CreateSchedulingUseCase };
