import { SchedulingModel } from '../Scheduling';

export type SchedulingAction = {
    scheduling_id: SchedulingModel['scheduling_id'];
    pivot_id: SchedulingModel['pivot_id'];
    power: 'ON' | 'OFF' | 'NULL';
    water: 'WET' | 'DRY' | 'NULL';
    direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | 'NULL';
    start_angle: number | 'NULL';
    end_angle: number | 'NULL';
    percentimeter: number;
    start_timestamp: Date | 'NULL';
    end_timestamp: Date | 'NULL';
    timestamp: Date | 'NULL';
    
  }

  ;