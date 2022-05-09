import { SchedulingHistoryModel } from '../SchedulingHistory';

export type SchedulingHistoryAction = {
    scheduling_history_id: SchedulingHistoryModel['scheduling_history_id'];
    user_id: SchedulingHistoryModel ['user_id'];
    pivot_id: SchedulingHistoryModel['pivot_id'];
    power: 'ON' | 'OFF' | 'NULL';
    water: 'WET' | 'DRY' | 'NULL';
    direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | 'NULL';
    percentimeter: number;
    start_timestamp: Date | 'NULL';
    end_timestamp: Date | 'NULL';
    timestamp: Date | 'NULL';
    
  }

  ;