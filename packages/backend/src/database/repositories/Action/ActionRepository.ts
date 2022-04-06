import knex from '../..';
import { ActionModel } from '../../model/Action';
import { CreateAction } from '../../model/types/action';
import { IActionRepository } from './IActionRepository';

class ActionRepository implements IActionRepository {
  async findById(action_id: string): Promise<ActionModel | undefined> {
    return await knex<ActionModel>('actions')
      .select()
      .where({ action_id })
      .first();
  }

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

  async delete(action_id: string): Promise<number> {
    return await knex<ActionModel>('actions')
      .select()
      .where({ action_id })
      .del();
  }
}

export { ActionRepository };
