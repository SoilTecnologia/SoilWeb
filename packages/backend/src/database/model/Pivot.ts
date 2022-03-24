import { FarmModel } from './Farm';
import { NodeModel } from './Node';

class PivotModel {
  pivot_id: string;

  node_id: NodeModel['node_id'];

  farm_id: FarmModel['farm_id'];

  pivot_num: number;

  pivot_lng: number;

  pivot_lat: number;

  pivot_start_angle: number;

  pivot_end_angle: number;

  pivot_radius: number;

  radio_id: number;
}

export { PivotModel };
