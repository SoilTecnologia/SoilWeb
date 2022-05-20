import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { dateLocal } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';

@injectable()
class UpdateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository
  ) {}

  async execute(
    scheduling_angle: SchedulingAngleModel,
    update_timestamp: Date
  ) {
    const getSchedulingAngle = await this.schedulingAngleRepository.findById(
      scheduling_angle.scheduling_angle_id
    );

    if (getSchedulingAngle) {
      const startDate = dayjs(getSchedulingAngle.timestamp);
      const nowDate = dateLocal(update_timestamp); //Nuvem

      dayjs.extend(isSameOrAfter);
      const dateIsAfter = dayjs(nowDate).isSameOrAfter(startDate);

      if (dateIsAfter) {
        console.log(
          'Não foi possivel atualizar o agendamento, pois ele já está em execução'
        );
        console.log('...');
        return 'scheduling is running';
      } else {
        const newSchedulingAngle = await this.schedulingAngleRepository.update({
          ...scheduling_angle,
          start_timestamp: dateLocal(scheduling_angle.start_timestamp!),
          timestamp: dateLocal(scheduling_angle.timestamp!)
        });

        if (newSchedulingAngle) {
          emitter.emit('scheduling-angle', {
            scheduling: newSchedulingAngle,
            isPut: true
          });
        }

        return newSchedulingAngle;
      }
    }
    throw new Error('Schedulings Angle Does Not Exists');
  }
}

export { UpdateSchedulingAngleUseCase };
