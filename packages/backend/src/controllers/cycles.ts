import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';

import knex from '../database';
import { last } from 'lodash';

export const getLastCycleFromPivot = async (
  pivot_id: Pivot['pivot_id']
): Promise<Array<{ angle: number }>> => {
  const lastState = await knex<State>('states')
    .select('power', 'state_id')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

  if (lastState) {
    if (lastState.power === true) {
      const lastOff = await knex<State>('states')
        .select('timestamp', 'power')
        .where('pivot_id', pivot_id)
        .where('power', false)
        .orderBy('timestamp', 'desc')
        .first();

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
    } else if (lastState.power === false) {
      return await knex<State>('state_variables')
        .select('angle')
        .where('state_id', lastState.state_id);
    }
  }

  return [];
};

type PartialCycleResponse = {
  start_date: Date;
  end_date: Date;
  is_running: boolean;
  start_state: {
    power: State['power'];
    water: State['water'];
    direction: State['direction'];
  };
  states: Array<{
    power: State['power'];
    water: State['water'];
    direction: State['direction'];
    connection: State['connection'];
    timestamp: Date;
  }>;
  percentimeters: Array<{value: number, timestamp: Date}>;
};
type fullCycleResponse = Array<PartialCycleResponse>;

// Date format for start/end must be: YYYY-MM-DD
export const getCyclesFromPivot = async (
  pivot_id: Pivot['pivot_id'],
  start: string,
  end: string
) => {
  // Get all status from a pivot and order it by last to more recent
  const states = await knex<State>('states')
    .select(
      'states.state_id',
      'power',
      'water',
      'direction',
      'timestamp',
      'connection'
    )
    .where('pivot_id', pivot_id)
    .whereBetween('timestamp', [start, end])
    .orderBy('timestamp', 'asc');
  let response: fullCycleResponse = [];

  /* 
      This will loop over all the states,
      once it finds a state with power = true,
      it will start a new cycle,
      and will add the state to the cycle,
      until it finds a state with power = false
    */
  let foundStart = false;
  let currentCycle: PartialCycleResponse = {states: [], percentimeters: []} as unknown as PartialCycleResponse;


  for (let state of states) {
    if (foundStart) {
      if (state.power === false) {
        currentCycle!.is_running = false;
        currentCycle!.end_date = state.timestamp;
        currentCycle!.states.push({
          power: state.power,
          water: state.water,
          direction: state.direction,
          timestamp: state.timestamp,
          connection: state.connection
        });

        response.push(currentCycle!);
        foundStart = false;
        currentCycle = {states: [], percentimeters: []} as unknown as PartialCycleResponse;
      } else {
        currentCycle!.states.push({
          power: state.power,
          water: state.water,
          direction: state.direction,
          timestamp: state.timestamp,
          connection: state.connection
        });
      }
    } else {
      if (state.power) {
        foundStart = true;
        currentCycle!.start_date = state.timestamp;
        currentCycle!.is_running = true;
        currentCycle!.start_state = {
          power: state.power,
          water: state.water,
          direction: state.direction
        };
        currentCycle!.states.push({
          power: state.power,
          water: state.water,
          direction: state.direction,
          timestamp: state.timestamp,
          connection: state.connection
        });
      }
    }

    const variables = await knex<StateVariable>('state_variables')
      .select('percentimeter', 'timestamp'/*'AVG(percentimeter)')*/)
      .where('state_id', state.state_id)
     .groupBy('angle', 'percentimeter', 'timestamp')


    for (let variable of variables) {
      if (variable)
        currentCycle!.percentimeters.push({value: variable.percentimeter!, timestamp: variable.timestamp!});
    }
  }

  //If there's one that started but hasn't ended, make sure to send it too
  if(foundStart)
  // if(currentCycle.states.length > 0 || currentCycle.percentimeters.length > 0) {
    response.push(currentCycle);
  //}
  
  // Return the reverse so that most recent cycles are shown
  return response.reverse();
};
