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

  private async applyQueryGetByUser(user_id: string) {
    try {
      return await this.schedulingHistoryRepository.findByUserId(user_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetUserSchedulingHistoryUseCase.name,
        'Get Scheduling History By User Id'
      );
    }
  }

  async execute(user_id: UserModel['password']) {
    const getUserSchedulingHistory = await this.applyQueryGetByUser(user_id);

    return getUserSchedulingHistory;
  }
}

export { GetUserSchedulingHistoryUseCase };
