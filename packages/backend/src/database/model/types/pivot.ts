import { FarmModel } from '../Farm';
import { NodeModel } from '../Node';
import { PivotModel } from '../Pivot';
import { RadioVariableModel } from '../RadioVariable';
import { StateModel } from '../State';
import { StateVariableModel } from '../StateVariables';

export type pivotPut = {
  pivot_num: number;
  pivot_lng: number;
  pivot_lat: number;
  pivot_start_angle: number;
  pivot_end_angle: number;
  pivot_radius: number;
  radio_id: number;
};
export interface pivotCreate extends pivotPut {
  node_id: NodeModel['node_id'];
  farm_id: FarmModel['farm_id'];
}

interface Pivot extends pivotCreate {
  pivot_id: string;
  // last_communication: Date;
}
export interface readAllPivots extends PivotModel {
  node_num: number;
  is_grps: boolean;
  gateway: string;
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

export interface PartialMapResponse
  extends Omit<PivotModel, 'radio_id' | 'farm_id' | 'node_id'> {
  power: StateModel['power'];
  connection: StateModel['connection'];
  water: StateModel['water'];
  direction: StateModel['direction'];
  start_angle: StateVariableModel['angle'];
  end_angle: StateVariableModel['angle'];
}

export type MapResponse = {
  farm_lng: FarmModel['farm_lng'];
  farm_lat: FarmModel['farm_lat'];
  pivots: PartialMapResponse[];
};

export type PartialListResponse = {
  pivot_id: PivotModel['pivot_id'];
  pivot_num: PivotModel['pivot_num'];
  power: StateModel['power'];
  water: StateModel['water'];
  direction: StateModel['direction'];
  percentimeter: StateVariableModel['percentimeter'];
  rssi: RadioVariableModel['rssi'];
  father: RadioVariableModel['father'];
  timestamp: RadioVariableModel['timestamp'] | null;
};

export default Pivot;
