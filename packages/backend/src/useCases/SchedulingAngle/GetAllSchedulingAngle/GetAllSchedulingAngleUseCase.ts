import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  private async applyQueryGetSchedule() {
    try {
      return await this.schedulingAngleRepository.getAllSchedulingsAngle();
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllSchedulingAngleUseCase.name,
        'Get Schedulings'
      );
    }
  }

  async execute() {
    const AllSchedulingsAngle = await this.applyQueryGetSchedule();

    return AllSchedulingsAngle;
  }
}

export { GetAllSchedulingAngleUseCase };
