import { inject, injectable } from 'tsyringe';
import { ISchedulingRepository } from '../../../database/repositories/Scheduling/ISchedulingRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllSchedulingUseCase {
  constructor(
    @inject('SchedulingRepository')
    private schedulingRepository: ISchedulingRepository
  ) {}
  private async applyQueryGetAllScheduling() {
    try {
      return await this.schedulingRepository.getAllSchedulings();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingUseCase.name,
        'GetAll Scheduling'
      );
    }
  }
  async execute() {
    return await this.applyQueryGetAllScheduling();
  }
}

export { GetAllSchedulingUseCase };
