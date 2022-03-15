export type PivotCreate = {
  node_id: string;
  farm_id: string;
  pivot_num: number;
  pivot_lng: number;
  pivot_lat: number;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  radio_id: number;
};

interface Pivot extends PivotCreate {
  pivot_id: string;
  // last_communication: Date | string;
}

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
export type PivotForm = {
  node_id: string;
  pivot_num: number;
  pivot_lng: string;
  pivot_lat: string;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  radio_id: number;
};
export interface PivotFormUpdate extends PivotForm {
  pivot_id: string;
}
