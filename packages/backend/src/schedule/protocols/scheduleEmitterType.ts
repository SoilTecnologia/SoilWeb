import { SchedulingModel } from '../../database/model/Scheduling';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';

interface ScheduleEmitter {
  scheduling: SchedulingModel;
  isPut: boolean;
}

interface ScheduleAngleEmitter {
  scheduling: SchedulingAngleModel;
  isPut: boolean;
}

export { ScheduleEmitter, ScheduleAngleEmitter };
