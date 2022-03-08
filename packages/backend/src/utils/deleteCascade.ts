import knex from '../database';

import User from '../models/user';
import Farm from '../models/farm';
import Node from '../models/node';
import Pivot from '../models/pivot';
import State from '../models/state';
import StateVariable from '../models/stateVariable';
import RadioVariable from '../models/radioVariable';
import Action from '../models/action';

export const deleteActions = async (
  typeRequest: 'user' | 'pivot',
  id: string
) => {
  const types = typeRequest === 'user' ? { user_id: id } : { pivot_id: id };
  const radioVariable = await knex<Action>('actions')
    .select()
    .where(types)
    .first();
  if (radioVariable) {
    await knex<Action>('actions').where(types).del();
  }
};

export const deleteRadioVariables = async (
  typeRequest: 'state' | 'pivot',
  id: string
) => {
  const types = typeRequest === 'state' ? { pivot_id: id } : { state_id: id };

  const radioVariable = await knex<RadioVariable>('radio_variables')
    .select()
    .where(types)
    .first();
  if (radioVariable) {
    await knex<RadioVariable>('radio_variables').where(types).del();
  }
};

export const deleteStateVariables = async (state_id: State['state_id']) => {
  const stateVariable = await knex<StateVariable>('state_variables')
    .select()
    .where({ state_id })
    .first();
  if (stateVariable) {
    await deleteRadioVariables('state', stateVariable.state_variable_id);
    await knex<StateVariable>('state_variables').where({ state_id }).del();
  }
};

export const deleteState = async (pivot_id: Pivot['pivot_id']) => {
  const state = await knex<State>('states')
    .select()
    .where({ pivot_id })
    .first();
  if (state) {
    await deleteStateVariables(state.state_id);
    await knex<State>('states').where({ pivot_id }).del();
  }
};

export const deletePivot = async (
  typeRequest: 'node' | 'pivot',
  id: string
) => {
  if (typeRequest === 'node') {
    const pivots = await knex<Pivot>('pivots').select().where({ node_id: id });
    if (pivots) {
      pivots.forEach(async (pivot) => {
        await deleteState(pivot.pivot_id);
        await deleteRadioVariables('pivot', pivot.pivot_id);
        await deleteActions('pivot', pivot.pivot_id);
      });
    }
    await knex<Pivot>('pivots').where({ node_id: id }).del();
  } else {
    const pivot = await knex<Pivot>('pivots')
      .select()
      .where({ pivot_id: id })
      .first();
    if (pivot) {
      await deleteState(pivot.pivot_id);
      await deleteRadioVariables('pivot', pivot.pivot_id);
      await deleteActions('pivot', pivot.pivot_id);
      await knex<Pivot>('pivots').where({ pivot_id: id }).del();
    }
  }

  // if (pivot) {
  //   await deleteState(pivot.pivot_id);
  //   await deleteRadioVariables('pivot', pivot.pivot_id);
  //   await deleteActions('pivot', pivot.pivot_id);
  //   await knex<Pivot>('pivots').where({ node_id }).del();
  // }
};

export const deleteNode = async (typeRequest: 'node' | 'farm', id: string) => {
  if (typeRequest === 'farm') {
    const nodes = await knex<Node>('nodes').select().where({ farm_id: id });
    if (nodes) {
      if (nodes && nodes.length > 0) {
        nodes.forEach(async (node) => {
          if (node.node_id) await deletePivot('node', node.node_id);
        });
      }
      await knex<Node>('nodes').where({ farm_id: id }).del();
    }
  } else {
    const node = await knex<Node>('nodes').where({ node_id: id });
    if (node) {
      await deletePivot('node', id);
      await knex<Node>('nodes').where({ node_id: id }).del();
    }
  }
};

export const deleteFarm = async (typeRequest: 'user' | 'farm', id: string) => {
  if (typeRequest === 'user') {
    const farms = await knex<Farm>('farms').select().where({ user_id: id });
    if (farms && farms.length > 0) {
      farms.forEach(async (farm) => {
        await deleteNode('farm', farm.farm_id);
      });
      await knex<Farm>('farms').where({ user_id: id }).del();
    }
  } else {
    const farm = await knex<Farm>('farms')
      .select()
      .where({ farm_id: id })
      .first();
    if (farm) {
      await deleteNode('farm', farm.farm_id);
      await knex<Farm>('farms').where({ farm_id: id }).del();
    }
  }
};

export const deleteUser = async (user_id: User['user_id']) => {
  const user = await knex<User>('users').select().where({ user_id }).first();
  if (user) {
    await deleteFarm('user', user_id);
    await knex<User>('users').where({ user_id }).del();
  }
};
