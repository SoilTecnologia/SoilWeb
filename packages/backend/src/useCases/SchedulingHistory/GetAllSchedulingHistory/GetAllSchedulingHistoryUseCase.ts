import { inject, injectable } from 'tsyringe';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}
  private async applyQueryGetAllSchedulingHistory() {
    try {
      return await this.schedulingHistoryRepository.getAllSchedulings();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingHistoryUseCase.name,
        'GetAll Scheduling History'
      );
    }
  }
  async execute() {
    return await this.applyQueryGetAllSchedulingHistory();
  }
}

export { GetAllSchedulingHistoryUseCase };
