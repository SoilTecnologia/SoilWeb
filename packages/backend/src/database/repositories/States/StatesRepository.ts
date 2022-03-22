import knex from '../..';
import State from '../../../models/state';
import { StateModel } from '../../model/State';
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

  async create(state: Omit<StateModel, 'state_id'>): Promise<State> {
    const newState = await knex<State>('states').insert(state).returning('*');

    return newState[0];
  }
}

export { StatesRepository };
