import { ActionModel } from '../database/model/Action';
import { PivotModel } from '../database/model/Pivot';
import { StateModel } from '../database/model/State';
import { StateVariableModel } from '../database/model/StateVariables';

export type ActionsResult = {
  action_id: string;
  power: StateModel['power'];
  water: StateModel['water'];
  direction: StateModel['direction'];
  percentimeter: StateVariableModel['percentimeter'];
  success: ActionModel['success'];
  timestamp_sent: ActionModel['timestamp_sent'];
  timestamp_success: ActionModel['timestamp_success'];
  author: string;
  pivot_id: PivotModel['pivot_id'];
  pivot_num: PivotModel['pivot_num'];
  pivot_lng: PivotModel['pivot_lng'];
  pivot_lat: PivotModel['pivot_lat'];
  pivot_start_angle: PivotModel['pivot_start_angle'];
  pivot_end_angle: PivotModel['pivot_end_angle'];
  pivot_radius: PivotModel['pivot_id'];
  radio_id: PivotModel['radio_id'];
  node_id: PivotModel['node_id'];
  farm_id: PivotModel['farm_id'];
};
