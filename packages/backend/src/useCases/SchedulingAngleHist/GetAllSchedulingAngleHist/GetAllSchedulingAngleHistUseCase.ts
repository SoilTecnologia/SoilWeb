import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllSchedulingAngleHistUseCase {
  constructor(
    @inject('SchedulingAngleHistRepository')
    private schedulingAngleHistRepository: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryGetSchedules() {
    try {
      return await this.schedulingAngleHistRepository.getAllSchedulingsAngle();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingAngleHistUseCase.name,
        'Get All Schedules'
      );
    }
  }
  async execute() {
    const AllSchedulingsAngleHist = await this.applyQueryGetSchedules();

    return AllSchedulingsAngleHist;
  }
}

export { GetAllSchedulingAngleHistUseCase };
