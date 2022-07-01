import { PivotModel } from '@root/database/model/Pivot';
import { addFarms } from '../farms/farms-values-mock';
import { uuidGlobal } from '../global';

export const addPivot: Omit<PivotModel, 'node_id'> = {
  pivot_id: `${addFarms.farm_id}_1`,
  pivot_num: 1,
  pivot_lng: -19.54644,
  pivot_lat: -47.6543,
  pivot_start_angle: 0,
  pivot_end_angle: 180,
  pivot_radius: 360,
  radio_id: 1,
  farm_id: addFarms.farm_id
};

export const newPivot = {
  ...addPivot,
  node_id: uuidGlobal
};
