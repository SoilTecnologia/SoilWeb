export type pivotPut = {
  pivot_name: string;
  pivot_lng: number;
  pivot_lat: number;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  radio_id: number;
};
export interface pivotCreate extends pivotPut {
  node_id: string;
}

interface Pivot extends pivotCreate {
  pivot_id: string;
  // last_communication: Date;
}

export type PivotUpdate = {
  pivot_id: string;
  connection: 'ONLINE' | 'OFFLINE';
  power: 'ON' | 'OFF' | 'NULL';
  water: 'WET' | 'DRY';
  direction: 'CLOCKWISE' | 'ANTI_CLOCKWISE';
  percentimeter: number;
  angle: number;
  timestamp: Date;
};

export default Pivot;
