import Action from '../models/action';

import knex from '../database';

export const readAllActionsController = async (): Promise<Action[]> => {
  const actions = await knex<Action>('actions')
    .select('*')
    .where({ success: null })

  return actions;
};
