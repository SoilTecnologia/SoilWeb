import Farm from '../models/farm';
import User from '../models/user';
import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';
import RadioVariable from '../models/radioVariable';

import {
  isStateDifferent,
  isStateVariableDifferent,
  isRadioVariableDifferent
} from '../utils/isDifferent';

import knex from '../database';
import emitter from '../utils/eventBus';
import { getLastCycleFromPivot } from './cycles';

export const createPivotController = async (
  pivot_id: Pivot['pivot_id'],
  node_id: Pivot['node_id'],
  radio_id: Pivot['radio_id'],
  pivot_name: Pivot['pivot_name'],
  pivot_lng: Pivot['pivot_lng'],
  pivot_lat: Pivot['pivot_lat'],
  pivot_start_angle: Pivot['pivot_start_angle'],
  pivot_end_angle: Pivot['pivot_end_angle'],
  pivot_radius: Pivot['pivot_radius']
) => {
  const newPivot = await knex<Pivot>('pivots').insert({
    pivot_id,
    node_id,
    radio_id,
    pivot_name,
    pivot_lng,
    pivot_lat,
    pivot_start_angle,
    pivot_end_angle,
    pivot_radius
  });

  return newPivot;
};

export const readAllPivotController = async (farm_id: Farm['farm_id']) => {
  const pivots = await knex<Pivot>('pivots')
    .select('*')
    .join('nodes', 'pivots.node_id', 'nodes.node_id')
    .where('nodes.farm_id', farm_id);

  return pivots;
};

export const readOnePivotController = async (pivot_id: Pivot['pivot_id']) => {
  const pivot = await knex<Pivot>('pivots')
    .select('*')
    .where({ pivot_id })
    .first();

  return pivot;
};

export const readAllPivotsController2 = async () => {
  const pivots = await knex<Pivot>('pivots').select('*');

  return pivots;
};

type PartialMapResponse = {
  pivot_id: Pivot['pivot_id'];
  pivot_lng: Pivot['pivot_lng'];
  pivot_lat: Pivot['pivot_lat'];
  pivot_start_angle: Pivot['pivot_start_angle'];
  pivot_end_angle: Pivot['pivot_end_angle'];
  pivot_radius: Pivot['pivot_radius'];
  power: State['power'];
  connection: State['connection'];
  water: State['water'];
  direction: State['direction'];
  start_angle: StateVariable['angle'];
  end_angle: StateVariable['angle'];
};
type MapResponse = {
  farm_lng: Farm['farm_lng'];
  farm_lat: Farm['farm_lat'];
  pivots: Array<PartialMapResponse>
};

export const readMapPivotController = async (
  user_id: User['user_id'],
  farm_id: Farm['farm_id']
): Promise<MapResponse> => {
  let pivotArray: Array<PartialMapResponse> = [];

  const farm = await knex<Farm>('farms').select('farm_lng', 'farm_lat').where('farm_id', farm_id).first();

  const nodes = await knex<Node>('nodes')
    .select('node_id')
    .where('farm_id', farm_id);

  for (let node of nodes) {
    const pivots = await knex<Pivot>('pivots')
      .select('pivot_id', 'pivot_name', 'pivot_lng', 'pivot_lat','pivot_start_angle', 'pivot_end_angle', 'pivot_radius')
      .where('node_id', node.node_id);

    for (let pivot of pivots) {
      const state = await knex<State>('states')
        .select('state_id', 'power', 'water', 'direction', 'connection')
        .where('pivot_id', pivot.pivot_id)
        .orderBy('timestamp', 'desc')
        .first();

      if (state) {
        const variables = await getLastCycleFromPivot(pivot.pivot_id);

        pivotArray.push({
          pivot_id: pivot.pivot_id,
          pivot_lng: pivot.pivot_lng,
          pivot_lat: pivot.pivot_lat,
          pivot_start_angle: pivot.pivot_start_angle,
          pivot_end_angle: pivot.pivot_end_angle,
          pivot_radius: pivot.pivot_radius,
          power: state.power,
          water: state.water,
          direction: state.direction,
          connection: state.connection,
          start_angle: variables[0]!.angle,
          end_angle: variables[variables.length - 1]!.angle
        });
      }
    }
  }

  return {
    farm_lat: farm!.farm_lat,
    farm_lng: farm!.farm_lng,
    pivots: pivotArray
  };
};

type PartialListResponse = {
  pivot_id: Pivot['pivot_id'];
  pivot_name: Pivot['pivot_name'];
  power: State['power'];
  water: State['water'];
  direction: State['direction'];
  percentimeter: StateVariable['percentimeter'];
  rssi: RadioVariable['rssi'];
  father: RadioVariable['father'];
  timestamp: StateVariable['timestamp'] | null;
};
type ListResponse = Array<PartialListResponse>;

export const readListPivotController = async (
  user_id: User['user_id'],
  farm_id: Farm['farm_id']
) => {
  let response: ListResponse = [];

  const nodes = await knex<Node>('nodes')
    .select('node_id')
    .where('farm_id', farm_id);

  for (let node of nodes) {
    const pivots = await knex<Pivot>('pivots')
      .select('pivot_id', 'pivot_name')
      .where('node_id', node.node_id);

    for (let pivot of pivots) {
      const state = await knex<State>('states')
        .select('state_id', 'power', 'water', 'direction')
        .where('pivot_id', pivot.pivot_id)
        .orderBy('timestamp', 'desc')
        .first();

      if (state) {
        const variable = await knex<StateVariable>('state_variables')
          .select('percentimeter', 'timestamp')
          .where('state_id', state.state_id)
          .orderBy('timestamp', 'desc')
          .first();

        response.push({
          pivot_id: pivot.pivot_id,
          pivot_name: pivot.pivot_name,
          power: state.power,
          water: state.water,
          direction: state.direction,
          percentimeter: variable ? variable.percentimeter : null,
          rssi: null,
          father: null,
          timestamp: variable ? new Date(variable.timestamp) : null
        });
      }
    }
  }

  return response;
};

export const updatePivotController = async (
  pivot_id: Pivot['pivot_id'],
  connection: State['connection'],
  power: State['power'],
  water: State['water'],
  direction: State['direction'],
  angle: StateVariable['angle'],
  percentimeter: StateVariable['percentimeter'],
  timestamp: Date,
  father: RadioVariable['father'],
  rssi: RadioVariable['rssi']
) => {
  let shouldNotifyUpdate = false;
  let state: State | undefined;
  timestamp = new Date(); // TODO usar a da placa (ta vindo com 2 bytes a mais me buganddo)

  let oldState = await knex<State>('states')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

    state = oldState;

  if (
    !oldState ||
    isStateDifferent(oldState, { connection, power, water, direction })
  ) {
    shouldNotifyUpdate = true;
    const newState = await knex<State>('states').insert({
      pivot_id,
      connection,
      power,
      water,
      direction,
      timestamp
    }).returning('*');

    state = newState[0];
  }

  if (angle != undefined && percentimeter != undefined) {
    if (state) {
      const oldStateVariable = await knex<StateVariable>('state_variables')
        .where('state_id', state.state_id)
        .orderBy('timestamp', 'desc')
        .first();

      if (
        !oldStateVariable ||
        isStateVariableDifferent(oldStateVariable, { angle, percentimeter })
      ) {
        shouldNotifyUpdate = true;
        await knex<StateVariable>('state_variables').insert({
          state_id: state.state_id,
          angle,
          percentimeter,
          timestamp
        });
      }
    }
  }

  if (father != undefined && rssi != undefined) {
    const oldRadioVariable = await knex<RadioVariable>('radio_variables')
      .where('pivot_id', pivot_id)
      .orderBy('timestamp', 'desc')
      .first();
    if (
      !oldRadioVariable ||
      isRadioVariableDifferent(oldRadioVariable, { father, rssi })
    ) {
      shouldNotifyUpdate = true;
      await knex<RadioVariable>('radio_variables').insert({
        pivot_id,
        state_id: state!.state_id,
        father,
        rssi,
        timestamp
      });
    }
  }

  //teste

  if (shouldNotifyUpdate) {
    const pivot = await knex('pivots').select('*').where({ pivot_id }).first();
    const { node_id } = pivot;

    const node = await knex('nodes').select('*').where({ node_id }).first();
    const { farm_id, node_name } = node;

    emitter.emit('status', {
      farm_id,
      node_name,
      payload: {
        pivot_id,
        connection,
        power,
        water,
        direction,
        angle,
        percentimeter,
        timestamp,
        father,
        rssi
      }
    });
  }

  return;
};
