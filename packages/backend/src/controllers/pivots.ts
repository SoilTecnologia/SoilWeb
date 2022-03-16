import knex from '../database';
import Farm from '../models/farm';
import Node from '../models/node';
import Pivot, { pivotCreate } from '../models/pivot';
import RadioVariable from '../models/radioVariable';
import State from '../models/state';
import StateVariable from '../models/stateVariable';
import User from '../models/user';
import emitter from '../utils/eventBus';
import {
  isRadioVariableDifferent,
  isStateDifferent,
  isStateVariableDifferent
} from '../utils/isDifferent';
import { getLastCycleFromPivot } from './cycles';

export const createPivotController = async (
  pivot_id: Pivot['pivot_id'],
  node_id: Pivot['node_id'],
  radio_id: Pivot['radio_id'],
  pivot_num: Pivot['pivot_num'],
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
    pivot_num,
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
  pivot_num: Pivot['pivot_num'];
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
  pivots: Array<PartialMapResponse>;
};

export const readMapPivotController = async (
  user_id: User['user_id'],
  farm_id: Farm['farm_id']
): Promise<MapResponse> => {
  let pivotArray: Array<PartialMapResponse> = [];

  const farm = await knex<Farm>('farms')
    .select('farm_lng', 'farm_lat')
    .where('farm_id', farm_id)
    .first();

  const nodes = await knex<Node>('nodes')
    .select('node_id')
    .where('farm_id', farm_id);

  for (let node of nodes) {
    const pivots = await knex<Pivot>('pivots')
      .select(
        'pivot_id',
        'pivot_num',
        'pivot_lng',
        'pivot_lat',
        'pivot_start_angle',
        'pivot_end_angle',
        'pivot_radius'
      )
      .where('node_id', node.node_id);

    for (let pivot of pivots) {
      const state = await knex<State>('states')
        .select('state_id', 'power', 'water', 'direction', 'connection')
        .where('pivot_id', pivot.pivot_id)
        .orderBy('timestamp', 'desc')
        .first();

      const variables = await getLastCycleFromPivot(pivot.pivot_id);

      if (state && variables && variables.length > 0) {
        pivotArray.push({
          pivot_id: pivot.pivot_id,
          pivot_lng: pivot.pivot_lng,
          pivot_lat: pivot.pivot_lat,
          pivot_num: pivot.pivot_num,
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
      } else {
        pivotArray.push({
          pivot_id: pivot.pivot_id,
          pivot_lng: pivot.pivot_lng,
          pivot_lat: pivot.pivot_lat,
          pivot_num: pivot.pivot_num,
          pivot_start_angle: pivot.pivot_start_angle,
          pivot_end_angle: pivot.pivot_end_angle,
          pivot_radius: pivot.pivot_radius,
          power: false,
          water: false,
          direction: null,
          connection: true,
          start_angle: pivot.pivot_start_angle,
          end_angle: pivot.pivot_start_angle
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
  pivot_num: Pivot['pivot_num'];
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

  const pivots = await knex<Pivot>('pivots').select().where({ farm_id });

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
        pivot_num: pivot.pivot_num,
        power: state.power,
        water: state.water,
        direction: state.direction,
        percentimeter: variable ? variable.percentimeter : null,
        rssi: null,
        father: null,
        timestamp: variable ? new Date(variable.timestamp) : null
      });
    } else {
      response.push({
        pivot_id: pivot.pivot_id,
        pivot_num: pivot.pivot_num,
        power: false,
        water: false,
        direction: null,
        percentimeter: 0,
        rssi: null,
        father: null,
        timestamp: null
      });
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
  let shouldNotifyState = false;
  let state: State | undefined;

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
    shouldNotifyState = true;
    const newState = await knex<State>('states')
      .insert({
        pivot_id,
        connection,
        power,
        water,
        direction,
        timestamp: new Date(timestamp)
      })
      .returning('*');

    state = newState[0];
  }

  if (angle !== undefined && percentimeter !== undefined) {
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
          timestamp: new Date(timestamp)
        });
      }
    }
  }

  if (father !== undefined && rssi !== undefined) {
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
        timestamp: new Date(timestamp)
      });
    }
  }

  // teste

  if (shouldNotifyUpdate) {
    const pivot = await knex('pivots').select('*').where({ pivot_id }).first();
    const { farm_id, node_id, pivot_num } = pivot;

    const node = await knex('nodes').select('*').where({ node_id }).first();
    const {node_num} = node;

    const farm = await knex('farms').select('*').where({ farm_id }).first();
    const {user_id, farm_name} = farm;


    emitter.emit('status', {
      farm_id,
      node_num,
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

    if (shouldNotifyState) {

      emitter.emit('state-change', {
        user_id,
        pivot_id,
        pivot_num,
        farm_name,
        power,
        water,
        direction,
        connection,
        percentimeter
      });
    } else {
      emitter.emit('variable-change', {
        user_id,
        pivot_id,
        percentimeter,
        angle
      });
    }
  }
};

// Admin
export const getAllPivotController = async (farm_id: Node['farm_id']) => {
  const pivots = await knex<Pivot>('pivots').select().where({ farm_id });
  return pivots;
};

export const getOnePivotController = async (
  pivot_num: Pivot['pivot_num'],
  farm_id: Pivot['farm_id']
) => {
  const pivots = await knex<Pivot>('pivots')
    .select()
    .where({ farm_id, pivot_num })
    .first();
  return pivots;
};

export const createPivotControllerAdm = async (pivot: pivotCreate) => {
  const pivot_id = `${pivot.farm_id}_${pivot.pivot_num}`;
  const newPivot = { ...pivot, pivot_id };

  const pivots = await knex<Pivot>('pivots').insert(newPivot);
  return pivots;
};
export const deletePivotController = async (pivot_id: Pivot['pivot_id']) => {
  try {
    const farm = await knex<Pivot>('pivots')
      .select()
      .where({ pivot_id })
      .first();
    if (farm) {
      const delResult = await knex<Pivot>('pivots')
        .select()
        .where({ pivot_id })
        .del();
      return delResult;
    }
  } catch (err) {
    console.log('[ERROR] Internal Server Error');
    console.log(err);
  }
};

export const putPivotController = async (pivot: Pivot) => {
  const pivot_id = `${pivot.farm_id}_${pivot.pivot_num}`;
  const getPivot = await knex<Pivot>('pivots')
    .select()
    .where({ pivot_id: pivot.pivot_id })
    .first();

  if (getPivot) {
    await knex<Pivot>('pivots')
      .where({ pivot_id: pivot.pivot_id })
      .update({
        ...getPivot,
        pivot_id,
        pivot_lat: pivot.pivot_lat ? pivot.pivot_lat : getPivot.pivot_lat,
        pivot_lng: pivot.pivot_lng ? pivot.pivot_lng : getPivot.pivot_lng,
        pivot_num: pivot.pivot_num ? pivot.pivot_num : getPivot.pivot_num,
        pivot_radius: pivot.pivot_radius
          ? pivot.pivot_radius
          : getPivot.pivot_radius,
        pivot_start_angle: pivot.pivot_start_angle
          ? pivot.pivot_start_angle
          : getPivot.pivot_start_angle,
        pivot_end_angle: pivot.pivot_end_angle
          ? pivot.pivot_end_angle
          : getPivot.pivot_end_angle,
        radio_id: pivot.radio_id ? pivot.radio_id : getPivot.radio_id
      });

    const newFarm = await knex<Pivot>('pivots')
      .select()
      .where({ pivot_id: pivot.pivot_id })
      .first();

    return newFarm;
  }
  throw new Error('Não fooi possivel atualizar Pivot');
};
