import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { ISchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateIsAter, dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: ISchedulingAngleRepository,
    @inject('SchedulingAngleHistRepository')
    private scheduleAngleHistory: ISchedulingAngleHistRepository
  ) {}

  private async applyQueryCreateHistory(
    scheduling: Omit<SchedulingAngleHistModel, 'scheduling_angle_hist_id'>
  ) {
    try {
      return await this.scheduleAngleHistory.create(scheduling);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingAngleUseCase.name,
        'CreateHistory'
      );
    }
  }
  private async applyQueryFindAngleById(scheduling_id: string) {
    try {
      return await this.schedulingAngleRepository.findById(scheduling_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateSchedulingAngleUseCase.name,
        'Find Schedule Angle By Id'
      );
    }
  }
  private async applyQueryUpdateSchedule(scheduling: SchedulingAngleModel) {
    try {
      return await this.schedulingAngleRepository.update(scheduling);
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
    const getSchedulingAngle = await this.applyQueryFindAngleById(
      scheduling_angle.scheduling_angle_id
    );

    if (getSchedulingAngle) {
      const dateIsRunning = dateIsAter(
        getSchedulingAngle.start_timestamp!,
        update_timestamp
      );

      if (dateIsRunning) {
        console.log(
          'Não foi possivel atualizar o agendamento, pois ele já está em execução'
        );
        console.log('...');
        return 'scheduling is running';
      } else {
        const newSchedulingAngle = await this.applyQueryUpdateSchedule({
          ...scheduling_angle,
          start_timestamp: dateSaoPaulo(scheduling_angle.start_timestamp!),
          timestamp: dateSaoPaulo(scheduling_angle.timestamp!)
        });

        if (newSchedulingAngle) {
          const schedule: Omit<
            SchedulingAngleHistModel,
            'scheduling_angle_hist_id'
          > = {
            ...newSchedulingAngle
          };
          delete schedule.scheduling_angle_id;

          await this.applyQueryCreateHistory({
            ...schedule,
            updated: newSchedulingAngle.scheduling_angle_id
          });

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
