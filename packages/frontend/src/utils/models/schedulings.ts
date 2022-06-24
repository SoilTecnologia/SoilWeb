interface Schedule {
  pivot_id: string;
  author: string|null|undefined;
  is_return?: boolean | null;
  is_stop?: boolean | null;
  power?: boolean | null;
  water?: boolean | null;
  direction?: "CLOCKWISE" | "ANTI_CLOCKWISE" | null;
  percentimeter?: number;
  start_angle?: number;
  end_angle?: number;
  start_timestamp?: Date|String|number;
  end_timestamp?: Date|String|number;
  timestamp: number;
}

export default Schedule;
