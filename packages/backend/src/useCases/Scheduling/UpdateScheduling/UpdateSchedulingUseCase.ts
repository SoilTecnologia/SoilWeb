import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}

  private async applyQueryFindById(scheduling_id: string) {
    try {
      return await this.schedulingRepository.findById(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Get Scheduling By Id'
      );
    }
  }

  private async applyQueryDelete(scheduling: SchedulingModel) {
    try {
      return await this.schedulingRepository.update(scheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingUseCase.name,
        'Update Scheduling '
      );
    }
  }

  async execute(scheduling: SchedulingModel) {
    const getScheduling = await this.applyQueryFindById(
      scheduling.scheduling_id
    );

    if (!getScheduling) throw new Error('Schedulings Does Not Exists');

    const newScheduling = await this.applyQueryDelete(scheduling);

    return newScheduling;
  }
}

export { UpdateSchedulingUseCase };
