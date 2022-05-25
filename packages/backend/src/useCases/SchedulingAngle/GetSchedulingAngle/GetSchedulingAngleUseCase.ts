import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  private async applyQueryGetSchedule(id: string) {
    try {
      return await this.schedulingAngleRepository.findByPivotId(id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetSchedulingAngleUseCase.name,
        'Get Schedulings'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getSchedulingAngle = await this.applyQueryGetSchedule(pivot_id);

    return getSchedulingAngle;
  }
}

export { GetSchedulingAngleUseCase };
