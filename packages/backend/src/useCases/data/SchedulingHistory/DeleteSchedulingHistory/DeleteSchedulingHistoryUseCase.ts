import { inject, injectable } from 'tsyringe';
import { SchedulingHistoryModel } from '../../../../database/model/SchedulingHistory';
import { ISchedulingHistoryRepository } from '../../../../database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class DeleteSchedulingHistoryUseCase {
  constructor(
    @inject('SchedulingHistoryRepository')
    private schedulingHistoryRepository: ISchedulingHistoryRepository
  ) {}

  private async applyQueryFindById(scheduling_history_id: string) {
    try {
      return await this.schedulingHistoryRepository.findById(
        scheduling_history_id
      );
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteSchedulingHistoryUseCase.name,
        'Get Scheduling History By Id'
      );
    }
  }

  private async applyQueryDelete(scheduling_history_id: string) {
    try {
      return await this.schedulingHistoryRepository.delete(
        scheduling_history_id
      );
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteSchedulingHistoryUseCase.name,
        'Delete Scheduling History'
      );
    }
  }

  async execute(
    scheduling_history_id: SchedulingHistoryModel['scheduling_history_id']
  ) {
    const schedulinghistory = await this.applyQueryFindById(
      scheduling_history_id
    );

    if (!schedulinghistory)
      throw new Error('Scheduling History does not exist');
    const deletedScheduleHistory = await this.applyQueryDelete(
      scheduling_history_id
    );
    console.log(
      `Historico de agendamento excluído com sucesso do banco de dados....`
    );
    console.log('....');

    return deletedScheduleHistory;
  }
}

export { DeleteSchedulingHistoryUseCase };
