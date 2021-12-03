import Pivot from '../models/pivots';
import Farm from '../models/farms';

import knex from '../database';

export const createPivotController = async (
  node_id: Pivot['node_id'],
  pivot_name: Pivot['pivot_name'],
  pivot_lng: Pivot['pivot_lng'],
  pivot_lat: Pivot['pivot_lat'],
  pivot_start_angle: Pivot['pivot_start_angle'],
  pivot_end_angle: Pivot['pivot_end_angle'],
  pivot_radius: Pivot['pivot_radius'],
) => {
  const newPivot = await knex<Pivot>('pivots').insert({
    node_id,
    pivot_name,
    pivot_lng,
    pivot_lat,
    pivot_start_angle,
    pivot_end_angle,
    pivot_radius,
  });

  return newPivot;
};

export const readAllPivotController = async (farm_id: Farm['farm_id']) => {
  const pivots = await knex<Pivot>('pivots').select('*').join('nodes', 'pivots.node_id', 'nodes.node_id').where('nodes.farm_id', farm_id);

  return pivots;
}