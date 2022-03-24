import knex from '../..';
import { ActionModel } from '../../model/Action';
import { CreateAction } from '../../model/types/action';
import { IActionRepository } from './IActionRepository';

class ActionRepository implements IActionRepository {
  async getNotSucess(): Promise<any[]> {
    return await knex<ActionModel>('actions')
      .select('*')
      .where({ success: null })
      .innerJoin('pivots', 'actions.pivot_id', '=', 'pivots.pivot_id');
  }

  async create(action: CreateAction): Promise<ActionModel[]> {
    const actionCreated = await knex<ActionModel>('actions')
      .insert(action)
      .returning('*');

    return actionCreated;
  }

  async update(action_id: string, success: boolean): Promise<void> {
    await knex<ActionModel>('actions').update({ success }).where({ action_id });
  }
}

export { ActionRepository };
