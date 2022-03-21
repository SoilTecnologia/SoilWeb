import knex from '../..';
import State from '../../../models/state';
import { IStateRepository } from './IState';

class StatesRepository implements IStateRepository {
  async findByPivotId(pivot_id: string): Promise<State | undefined> {
    return await knex<State>('states')
      .select()
      .where({ pivot_id })
      .orderBy('timestamp', 'desc')
      .first();
  }

  async findById(state_id: string): Promise<State | undefined> {
    return await knex<State>('states')
      .select()
      .where({ state_id })
      .orderBy('timestamp', 'desc')
      .first();
  }
}

export { StatesRepository };
