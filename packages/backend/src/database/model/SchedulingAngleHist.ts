class SchedulingAngleHistModel {
  scheduling_angle_hist_id: string;

  pivot_id: string;

  author: string;

  updated?: string;

  is_return: boolean;

  power: boolean | null;

  water: boolean | null;

  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE' | null;

  percentimeter: number | null;

  start_angle: number | null;

  end_angle: number | null;

  start_timestamp: Date | null;

  timestamp: Date | null;
}

export { SchedulingAngleHistModel };
