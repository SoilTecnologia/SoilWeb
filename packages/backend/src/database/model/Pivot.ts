import Farm from '../../models/farm';
import Node from '../../models/node';

class PivotModel {
  pivot_id: string;

  node_id: Node['node_id'];

  farm_id: Farm['farm_id'];

  pivot_num: number;

  pivot_lng: number;

  pivot_lat: number;

  pivot_start_angle: number;

  pivot_end_angle: number;

  pivot_radius: number;

  radio_id: number;
}

export { PivotModel };
