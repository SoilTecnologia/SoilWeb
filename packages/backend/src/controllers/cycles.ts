import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';

import knex from '../database';

export const getLastCycleFromPivot = async (pivot_id: Pivot['pivot_id']) => {
  const lastState = await knex<State>('states')
    .select('timestamp', 'power')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

  if (lastState) {
    if (lastState.power) {
      const lastOff = await knex<State>('states')
        .select('timestamp')
        .where('pivot_id', pivot_id)
        .orderBy('timestamp', 'desc')
        .first();

				console.log("AKI PORRA")
				console.log(lastOff!.timestamp)
				console.log(lastState.timestamp)

      if (lastOff) {

        const cycle = await knex<State>('states')
          .select('*')
          .where('pivot_id', pivot_id)
          .andWhereBetween('timestamp', [
            lastOff?.timestamp,
            lastState.timestamp
          ]);

					return cycle
      }
    } else {
			return lastState;
		}
  }

	return null
};
