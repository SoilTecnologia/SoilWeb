import { PivotModel } from '../database/model/Pivot';
import Farm from './farm';
import Node from './node';
import State from './state';
import StateVariable from './stateVariable';

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
  node_id: Node['node_id'];
  farm_id: Farm['farm_id'];
}

interface Pivot extends pivotCreate {
  pivot_id: string;
  // last_communication: Date;
}
export interface realdAllPivots extends PivotModel {
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
  power: State['power'];
  connection: State['connection'];
  water: State['water'];
  direction: State['direction'];
  start_angle: StateVariable['angle'];
  end_angle: StateVariable['angle'];
}

export type MapResponse = {
  farm_lng: Farm['farm_lng'];
  farm_lat: Farm['farm_lat'];
  pivots: PartialMapResponse[];
};

export default Pivot;
