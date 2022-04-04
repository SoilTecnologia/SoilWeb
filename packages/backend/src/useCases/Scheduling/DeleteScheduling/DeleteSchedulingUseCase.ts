import { inject, injectable } from 'tsyringe';
import { SchedulingModel } from '../../../database/model/Scheduling';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteSchedulingUseCase {
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
        DeleteSchedulingUseCase.name,
        'Get Scheduling By Id'
      );
    }
  }

  private async applyQueryDelete(scheduling_id: string) {
    try {
      return await this.schedulingRepository.delete(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteSchedulingUseCase.name,
        'Delete Scheduling '
      );
    }
  }

  async execute(scheduling_id: SchedulingModel['scheduling_id']) {
    const scheduling = await this.applyQueryFindById(scheduling_id);

    if (!scheduling) throw new Error('Scheduling does not exist');
    return await this.applyQueryDelete(scheduling_id);
  }
}

export { DeleteSchedulingUseCase };
