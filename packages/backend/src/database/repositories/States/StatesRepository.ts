import knex from '../..';
import { StateModel } from '../../model/State';
import { IStateRepository } from './IState';

class StatesRepository implements IStateRepository {
  async findByPivotId(pivot_id: string): Promise<StateModel | undefined> {
    return await knex<StateModel>('states')
      .select()
      .where({ pivot_id })
      .orderBy('timestamp', 'desc')
      .first();
  }

  async findById(state_id: string): Promise<StateModel | undefined> {
    return await knex<StateModel>('states')
      .select()
      .where({ state_id })
      .orderBy('timestamp', 'desc')
      .first();
  }

  async create(
    state: Omit<StateModel, 'state_id'>
  ): Promise<StateModel | undefined> {
    const newState = await knex<StateModel>('states')
      .insert(state)
      .returning('*');

    return newState[0];
  }

  async getLastState(
    pivot_id: string
  ): Promise<Pick<StateModel, 'state_id' | 'power'> | undefined> {
    return await knex<StateModel>('states')
      .select('power', 'state_id')
      .where('pivot_id', pivot_id)
      .orderBy('timestamp', 'desc')
      .first();
  }

  async getLastOffState(
    pivot_id: string
  ): Promise<Pick<StateModel, 'power' | 'timestamp'> | undefined> {
    return await knex<StateModel>('states')
      .select('timestamp', 'power')
      .where('pivot_id', pivot_id)
      .where('power', false)
      .orderBy('timestamp', 'desc')
      .first();
  }

  async beforeThat(
    pivot_id: string,
    timestamp: StateModel['timestamp']
  ): Promise<any[]> {
    return await knex<StateModel>('states')
      .innerJoin(
        'state_variables',
        'state_variables.state_id',
        'states.state_id'
      )
      .select('angle', 'percentimeter')
      .where('pivot_id', pivot_id)
      .where('states.timestamp', '>', timestamp);
  }

  async getHistoryCycle(
    pivot_id: string,
    start: string,
    end: string
  ): Promise<any[]> {
    return await knex<StateModel>('states')
      .select(
        'states.state_id',
        'power',
        'water',
        'direction',
        'timestamp',
        'connection'
      )
      .where('pivot_id', pivot_id)
      .where('timestamp', '>=', `${start}T00:00:00`)
      .where('timestamp', '<=', `${end}T23:59:59Z`)
      .orderBy('timestamp', 'asc');
  }
}

export { StatesRepository };
