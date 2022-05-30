import { SchedulingModel } from '../../database/model/Scheduling';
import { SchedulingAngleModel } from '../../database/model/SchedulingAngle';
import { Job } from 'node-schedule';

type CallbackProps = (job: any) => void;

interface JobSchedulingModel {
  job: SchedulingModel;
}

interface JobSchedulingAngleModel {
  job: SchedulingAngleModel;
}

interface AngleDiferentprops {
  job: Job | undefined;
  oldAngle: number;
  newAngle: number;
  pivot_id: string;
}

export {
  CallbackProps,
  JobSchedulingModel,
  AngleDiferentprops,
  JobSchedulingAngleModel
};
