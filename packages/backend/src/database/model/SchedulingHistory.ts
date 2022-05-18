import { StateModel } from './State';

class SchedulingHistoryModel {
  scheduling_history_id: string;

  pivot_id: string;

  author: string;

  is_stop: boolean;

  power: boolean | null;

  water: boolean;

  direction: StateModel['direction'];

  percentimeter: number | null;

  start_timestamp: Date | null;

  end_timestamp: Date | null;

  timestamp: Date | null;
}

export { SchedulingHistoryModel };
