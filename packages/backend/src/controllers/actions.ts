import Action from '../models/action';

import knex from '../database';
import emitter from '../utils/eventBus';

export const readAllActionsController = async (): Promise<Action[]> => {
  const actions = await knex<Action>('actions')
    .select('*')
    .where({ success: null });

  return actions;
};

export const createActionController = async (
  pivot_id: Action['pivot_id'],
  radio_id: Action['radio_id'],
  author: Action['author'],
  power: Action['power'],
  water: Action['water'],
  direction: Action['direction'],
  percentimeter: Action['percentimeter'],
  timestamp: Action['timestamp_sent']
) => {
  let action = await knex<Action>('actions')
    .insert({
      pivot_id,
      power,
      water,
      direction,
      percentimeter,
      timestamp_sent: timestamp,
      radio_id,
      author
    })

    const [row] = await knex.select(knex.raw('LAST_INSERT_ID() as id'));

  console.log('CREATED ACTION: ', row.id);

  const pivot = await knex('pivots').select('*').where({ pivot_id }).first();
  const { node_id } = pivot;

  const node = await knex('nodes').select('*').where({ node_id }).first();
  const { farm_id, node_name } = node;

  emitter.emit('action', {
    farm_id,
    node_name,
    payload: {
      action_id: row.action_id,
      pivot_id,
      radio_id,
      author,
      power,
      water,
      direction,
      percentimeter,
      timestamp
    }
  });

  return action;
};

export const updateActionController = async (
  action_id: Action['action_id'],
  success: boolean
) => {
  await knex<Action>('actions').update({ success }).where({ action_id });
};