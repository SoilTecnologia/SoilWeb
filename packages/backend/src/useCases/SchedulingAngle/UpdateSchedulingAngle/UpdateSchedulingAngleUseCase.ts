import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateLocal, dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository,
    @inject('SchedulingAngleRepository')
    private schedulingAngleHistory: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryCreateHistory(scheduling: SchedulingAngleModel) {
    try {
      return await this.schedulingAngleHistory.create({
        ...scheduling,
        updated: scheduling.scheduling_angle_id
      });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingAngleUseCase.name,
        'CreateHistory'
      );
    }
  }
  async execute(
    scheduling_angle: SchedulingAngleModel,
    update_timestamp: Date
  ) {
    const getSchedulingAngle = await this.schedulingAngleRepository.findById(
      scheduling_angle.scheduling_angle_id
    );

    if (getSchedulingAngle) {
      const startDate = dayjs(getSchedulingAngle.timestamp);
      const nowDate = dateSaoPaulo(update_timestamp); //Nuvem

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
          start_timestamp: dateSaoPaulo(scheduling_angle.start_timestamp!),
          timestamp: dateSaoPaulo(scheduling_angle.timestamp!)
        });

        if (newSchedulingAngle) {
          await this.applyQueryCreateHistory(newSchedulingAngle);
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
