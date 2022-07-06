import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { SchedulingAngleModel } from '../../../database/model/SchedulingAngle';
import { SchedulingAngleHistModel } from '../../../database/model/SchedulingAngleHist';
import { SchedulingAngleRepository } from '../../../database/repositories/SchedulingAngle/SchedulingAngleRepository';
import { ISchedulingAngleHistRepository } from '../../../database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { dateSaoPaulo } from '../../../utils/convertTimeZoneDate';
import emitter from '../../../utils/eventBus';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateSchedulingAngleUseCase {
  constructor(
    @inject('SchedulingAngleRepository')
    private schedulingAngleRepository: SchedulingAngleRepository,
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
        CreateSchedulingAngleUseCase.name,
        'Create angle history'
      );
    }
  }

  private async applyQueryCreateAngle(schedulingAngle: SchedulingAngleModel) {
    try {
      return await this.schedulingAngleRepository.create(schedulingAngle);
    } catch (error) {
      messageErrorTryAction(
        error,
        false,
        CreateSchedulingAngleUseCase.name,
        'Create Scheduling'
      );
    }
  }

  async execute(
    schedulingangle: Omit<SchedulingAngleModel, 'scheduling_angle_id'>
  ) {
    const {
      pivot_id,
      author,
      start_angle,
      end_angle,
      is_return,
      direction,
      power,
      water,
      percentimeter,
      start_timestamp,
      timestamp
    } = schedulingangle;

    const schedulingAngleModel = new SchedulingAngleModel();

    Object.assign(schedulingAngleModel, {
      ...schedulingangle,
      power: is_return ? true : power,
      water: is_return ? false : water,
      percentimeter: is_return ? 100 : percentimeter,
      start_timestamp: dateSaoPaulo(start_timestamp!),
      timestamp: dateSaoPaulo(timestamp!)
    });
    console.log(
      `Criando Novo agendamento por angulo às ${timestamp} com \nInicio às ${start_timestamp}  `
    );
    const newSchedulingAngleData = await this.applyQueryCreateAngle(
      schedulingAngleModel
    );

    if (newSchedulingAngleData) {
      type omitId = Omit<SchedulingAngleHistModel, 'scheduling_angle_hist_id'>;
      const schedule: omitId = newSchedulingAngleData;
      delete schedule.scheduling_angle_id;

      await this.applyQueryCreateHistory(schedule);

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
