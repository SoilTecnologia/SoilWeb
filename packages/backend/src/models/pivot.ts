type Pivot = {
  pivot_id: string;
  node_id: string;
  pivot_name: string;
  pivot_lng: number;
  pivot_lat: number;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  last_communication: Date;
  radio_id: number;
};

export type PivotUpdate = {
  pivot_id: string;
  connection: "ONLINE" | "OFFLINE";
  power: "ON" | "OFF" | "NULL";
  water: "WET" | "DRY";
  direction: "CLOCKWISE" | "ANTI_CLOCKWISE";
  percentimeter: number;
  angle: number;
  timestamp: Date;
};

export default Pivot;
