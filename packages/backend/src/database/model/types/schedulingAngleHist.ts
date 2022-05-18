import { SchedulingAngleHistModel } from "../SchedulingAngleHist";

export type SchedulingAngleAction = {
    scheduling_id: SchedulingAngleHistModel['scheduling_angle_hist_id'];
    pivot_id: SchedulingAngleHistModel['pivot_id'];
    is_return: boolean;
    power: 'ON' | 'OFF' | 'NULL';
    water: 'WET' | 'DRY' | 'NULL';
    direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | 'NULL';
    percentimeter: number;
    start_angle: number | 'NULL';
    end_angle: number | 'NULL';
    timestamp: Date | 'NULL';
    
  }

  ;