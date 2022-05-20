import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { SchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/SchedulingAngleRepository';
import { dateLocal } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';

@injectable()
class CreateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: SchedulingAngleRepository
  ) {}

  async execute(
    schedulingangle: Omit<SchedulingAngleModel, 'scheduling_angle_id'>
  ) {
    const {
      pivot_id,
      is_return,
      author,
      power,
      water,
      direction,
      percentimeter,
      start_angle,
      end_angle,
      start_timestamp,
      timestamp
    } = schedulingangle;

    const schedulingAngleModel = new SchedulingAngleModel();

    Object.assign(schedulingAngleModel, {
      pivot_id,
      is_return,
      author,
      power: is_return ? true : power,
      water: is_return ? false : water,
      direction,
      percentimeter: is_return ? 100 : percentimeter,
      start_angle: is_return ? 0 : start_angle,
      end_angle: is_return ? 0 : end_angle,
      start_timestamp: dateLocal(start_timestamp!),
      timestamp: dateLocal(timestamp!)
    });

    const newSchedulingAngleData = await this.schedulingAngleRepository.create(
      schedulingAngleModel
    );
    if (newSchedulingAngleData) {
      console.log('Agendamento por angulo criado no banco de dados....');
      emitter.emit('scheduling-angle', {
        scheduling: newSchedulingAngleData,
        isPut: false
      });
    }
    return newSchedulingAngleData;
  }
}

export { CreateSchedulingAngleUseCase };
