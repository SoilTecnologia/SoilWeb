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
): Promise<Action> => {
  const action = await knex<Action>('actions')
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
    .returning('*');

    const pivot = await knex('pivots').select("*").where({pivot_id}).first();
    const {node_id} = pivot;

    const node = await knex('nodes').select('*').where({node_id}).first();
    const {farm_id, node_name} = node;

    emitter.emit('action', {
      farm_id,
      node_name,
      payload: {
        pivot_id,
        radio_id,
        author,
        power,
        water,
        direction,
        percentimeter,
        timestamp,
      }
    });

  console.log(action);

  return action[0];
};
