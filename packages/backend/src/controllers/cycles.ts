import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';

import knex from '../database';

export const getLastCycleFromPivot = async (
  pivot_id: Pivot['pivot_id']
): Promise<Array<{ angle: number }>> => {
  const lastState = await knex<State>('states')
    .select('power', 'state_id')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

  if (lastState) {
    if (lastState.power) {
      const lastOff = await knex<State>('states')
        .select('timestamp', 'power')
        .where('pivot_id', pivot_id)
        .where('power', false)
        .orderBy('timestamp', 'desc')
        .first();

      console.log('last: ', lastOff!.timestamp);
      const beforeThat = await knex<State>('states')
        .innerJoin(
          'state_variables',
          'state_variables.state_id',
          'states.state_id'
        )
        .select('angle')
        .where('pivot_id', pivot_id)
        .where('states.timestamp', '>', lastOff!.timestamp);

      return beforeThat;
    } else {
      
      return await knex<State>('state_variables')
        .select('angle')
        .where('state_id', lastState.state_id);
    }
  }
  return [];
};


// Date format for start/end must be: YYYY-MM-DD
export const getCyclesFromPivot = async (pivot_id: Pivot['pivot_id'], start: string, end: string) => {
  const cycles = await knex<State>('states')
    .innerJoin(
      'state_variables',
      'state_variables.state_id',
      'states.state_id'
    )
    .select('angle', 'percentimeter', 'state_variables.timestamp as variable_timestamp', 'states.timestamp')
    .where('pivot_id', pivot_id)
    .whereBetween('state_variables.timestamp', [start, end]);

  return cycles;
}
