import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../../database/model/SchedulingAngle';
import { ISchedulingAngleRepository } from '../../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class DeleteSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingangleRepository: ISchedulingAngleRepository
  ) {}

  async applyQueryFindAngle(id: string) {
    try {
      return await this.schedulingangleRepository.findById(id);
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        DeleteSchedulingAngleUseCase.name,
        'FindById'
      );
    }
  }

  async applyQueryDeleteAngle(id: string) {
    try {
      return await this.schedulingangleRepository.delete(id);
    } catch (error) {
      messageErrorTryAction(
        error,
        true,
        DeleteSchedulingAngleUseCase.name,
        'FindById'
      );
    }
  }
  async execute(
    schedulingangle_id: SchedulingAngleModel['scheduling_angle_id']
  ) {
    const schedulingangle = await this.applyQueryFindAngle(schedulingangle_id);

    if (schedulingangle) {
      const schedulingangle = await this.applyQueryDeleteAngle(
        schedulingangle_id
      );

      return schedulingangle;
    }

    throw new Error('Scheduling does not exist');
  }
}

export { DeleteSchedulingAngleUseCase };
