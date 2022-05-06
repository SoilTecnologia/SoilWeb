import { SchedulingAngleModel } from "../SchedulingAngle";

export type SchedulingAngleAction = {
    scheduling_id: SchedulingAngleModel['schedulingangle_id'];
    pivot_id: SchedulingAngleModel['pivot_id'];
    power: 'ON' | 'OFF' | 'NULL';
    water: 'WET' | 'DRY' | 'NULL';
    direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | 'NULL';
    percentimeter: number;
    start_angle: number | 'NULL';
    end_angle: number | 'NULL';
    timestamp: Date | 'NULL';
    
  }

  ;