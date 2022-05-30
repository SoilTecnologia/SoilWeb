import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { ISchedulingHistoryRepository } from '../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetUserSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}

  private async applyQueryGetByUser(author: string) {
    try {
      return await this.schedulingHistoryRepository.findByUserId(author);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetUserSchedulingHistoryUseCase.name,
        'Get Scheduling History By User Id'
      );
    }
  }

  async execute(author: UserModel['password']) {
    const getUserSchedulingHistory = await this.applyQueryGetByUser(author);

    return getUserSchedulingHistory;
  }
}

export { GetUserSchedulingHistoryUseCase };
