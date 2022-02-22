import knex from '../database';

import State from '../models/state';
import StateVariable from '../models/stateVariable';
import Pivot from '../models/pivot';

import { getLastCycleFromPivot } from './cycles';

type StateResponse = {
  pivot_id: Pivot['pivot_id'];
  pivot_name: Pivot['pivot_name'];
  pivot_lng: Pivot['pivot_lng'];
  pivot_lat: Pivot['pivot_lat'];
  pivot_start_angle: Pivot['pivot_start_angle'];
  pivot_end_angle: Pivot['pivot_end_angle'];
  pivot_radius: Pivot['pivot_radius'];
  power: State['power'];
  connection: State['connection'];
  water: State['water'];
  percentimeter: StateVariable['percentimeter'];
  direction: State['direction'];
  start_angle: StateVariable['angle'];
  end_angle: StateVariable['angle'];
};

export const readPivotStateController = async (
  pivot_id: Pivot['pivot_id']
): Promise<StateResponse | null> => {
  const pivot = await knex<Pivot>('pivots')
    .select(
      'pivot_id',
      'pivot_name',
      'pivot_lng',
      'pivot_lat',
      'pivot_start_angle',
      'pivot_end_angle',
      'pivot_radius'
    )
    .where('pivot_id', pivot_id)
    .first();

  const state = await knex<State>('states')
    .select('state_id', 'power', 'water', 'direction', 'connection')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

  if (state) {
    const variables = await getLastCycleFromPivot(pivot_id);

    if (variables && variables.length > 0) {
      return {
        pivot_id: pivot_id,
        pivot_name: pivot!.pivot_name,
        pivot_lng: pivot!.pivot_lng,
        pivot_lat: pivot!.pivot_lat,
        pivot_start_angle: pivot!.pivot_start_angle,
        pivot_end_angle: pivot!.pivot_end_angle,
        pivot_radius: pivot!.pivot_radius,
        power: state.power,
        water: state.water,
        direction: state.direction,
        connection: state.connection,
        percentimeter: variables[variables.length-1]!.percentimeter,
        start_angle: variables[0]!.angle,
        end_angle: variables[variables.length - 1]!.angle
      };
    } else {
      return {
        pivot_id: pivot_id,
        pivot_name: pivot!.pivot_name,
        pivot_lng: pivot!.pivot_lng,
        pivot_lat: pivot!.pivot_lat,
        pivot_start_angle: pivot!.pivot_start_angle,
        pivot_end_angle: pivot!.pivot_end_angle,
        pivot_radius: pivot!.pivot_radius,
        power: state.power,
        water: state.water,
        direction: state.direction,
        connection: state.connection,
        percentimeter: 0,
        start_angle: null,
        end_angle: null
      };
    }
  }

  return null;
};
