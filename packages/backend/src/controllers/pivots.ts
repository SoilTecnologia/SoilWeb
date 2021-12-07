import Farm from '../models/farm';
import Pivot from '../models/pivot';
import States from '../models/state';
import StateVariables from '../models/stateVariable';
import RadioVariables from '../models/radioVariable';

import {
  isStateDifferent,
  isStateVariableDifferent,
  isRadioVariableDifferent
} from '../utils/isDifferent';

import knex from '../database';
import emitter from '../utils/eventBus';

export const createPivotController = async (
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

export const readAllPivotsController2 = async () => {
  const pivots = await knex<Pivot>('pivots').select('*');

  return pivots;
};

export const updatePivotController = async (
  pivot_id: Pivot['pivot_id'],
  connection: States['connection'],
  power?: States['power'],
  water?: States['water'],
  direction?: States['direction'],
  angle?: StateVariables['angle'],
  percentimeter?: StateVariables['percentimeter'],
  father?: RadioVariables['father'],
  rssi?: RadioVariables['rssi']
) => {
  let shouldNotifyUpdate = false;

  const oldState = await knex<States>('states')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();
  const oldStateVariable = await knex<StateVariables>('state_variables')
    .where('pivot_id', pivot_id)
    .orderBy('timestamp', 'desc')
    .first();

  if (
    !oldState ||
    isStateDifferent(oldState, { connection, power, water, direction })
  ) {
    shouldNotifyUpdate = true;
    await knex<States>('states').insert({
      pivot_id,
      connection,
      power,
      water,
      direction: undefined,
      timestamp: new Date()
    });
  }

  if (angle != undefined && percentimeter != undefined) {
    if (
      !oldStateVariable ||
      isStateVariableDifferent(oldStateVariable, { angle, percentimeter })
    ) {
      shouldNotifyUpdate = true;
      await knex<StateVariables>('state_variables').insert({
        pivot_id,
        angle,
        percentimeter,
        timestamp: new Date()
      });
    }
  }

  if (father != undefined && rssi != undefined) {
    const oldRadioVariable = await knex<RadioVariables>('radio_variables')
      .where('pivot_id', pivot_id)
      .orderBy('timestamp', 'desc')
      .first();
    if (
      !oldRadioVariable ||
      isRadioVariableDifferent(oldRadioVariable, { father, rssi })
    ) {
      shouldNotifyUpdate = true;
      await knex<RadioVariables>('radio_variables').insert({
        pivot_id,
        father,
        rssi,
        timestamp: new Date()
      });
    }
  }

  if (shouldNotifyUpdate) {
    const pivot = await knex('pivots').select("*").where({pivot_id}).first();
    const {node_id} = pivot;

    const node = await knex('nodes').select('*').where({node_id}).first();
    const {farm_id, node_name} = node;

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
        father,
        rssi
      }
    });
  }

  return;
};
