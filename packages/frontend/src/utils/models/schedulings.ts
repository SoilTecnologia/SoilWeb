interface Schedule {
  pivot_id: string;
  author: string | null | undefined;
  is_return?: boolean | null;
  is_stop?: boolean | null;
  power?: boolean | null;
  water?: boolean | null;
  direction?: "CLOCKWISE" | "ANTI_CLOCKWISE" | null;
  percentimeter?: number;
  start_angle?: number;
  end_angle?: number;
  start_timestamp?: Date | string | number;
  end_timestamp?: Date | string | number;
  timestamp: number;
}
export interface DateSchedule {
  author: string;
  direction: "CLOCKWISE" | "ANTI_CLOCKWISE" | null;
  end_timestamp: string | Date;
  is_stop: boolean;
  percentimeter: number;
  pivot_id: string;
  power: boolean;
  scheduling_id: string;
  start_timestamp: string | Date;
  timestamp: string;
  water: boolean;
}
export interface AngleSchedule {
  author: string;
  direction: "CLOCKWISE" | "ANTI_CLOCKWISE" | null;
  end_angle: number;
  is_return: boolean;
  percentimeter: number;
  pivot_id: string;
  power: boolean;
  scheduling_angle_id: string;
  start_angle: number;
  start_timestamp: string | Date;
  timestamp: string | Date;
  water: boolean;
}

export default Schedule;
