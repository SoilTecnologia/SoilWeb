import { inject, injectable } from 'tsyringe';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';

@injectable()
class GetAllSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  async execute() {
    const AllSchedulingsAngle =
      await this.schedulingAngleRepository.getAllSchedulingsAngle();

    return AllSchedulingsAngle;
  }
}

export { GetAllSchedulingAngleUseCase };
