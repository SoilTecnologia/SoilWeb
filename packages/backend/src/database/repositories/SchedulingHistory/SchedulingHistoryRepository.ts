import knex from '../..';
import { SchedulingHistoryModel } from '../../model/SchedulingHistory';
import { ISchedulingHistoryRepository } from './ISchedulingHistoryRepository';

class SchedulingHistoryRepository implements ISchedulingHistoryRepository {
  async findByPivotId(pivot_id: string): Promise<SchedulingHistoryModel[]> {
    return await knex<SchedulingHistoryModel>('scheduling_historys')
      .select('*')
      .where({ pivot_id })
      .orderBy('start_timestamp', 'asc');
  }

  async findByUserId(user_id: string | undefined): Promise<SchedulingHistoryModel[] | undefined> {
    return await knex<SchedulingHistoryModel>('scheduling_historys')
      .select('*')
      .where({ user_id }) 
      .orderBy('start_timestamp', 'asc');
  }

  async findById(scheduling_history_id: string): Promise<SchedulingHistoryModel | undefined> {
    return await knex<SchedulingHistoryModel>('scheduling_historys')
      .select()
      .where({ scheduling_history_id })
      .orderBy('start_timestamp', 'asc')
      .first();
  }

  async getAllSchedulings(): Promise<SchedulingHistoryModel[]> {
    return await knex<SchedulingHistoryModel>('scheduling_historys').select();
  }

  async create(
    scheduling_history: Omit<SchedulingHistoryModel, 'scheduling_history_id'>
  ): Promise<SchedulingHistoryModel | undefined> {
    const newSchedulingHistory = await knex<SchedulingHistoryModel>('scheduling_historys')
      .insert(scheduling_history)
      .returning('*');

    return newSchedulingHistory[0];
  }

  async delete(scheduling_history_id: string): Promise<SchedulingHistoryModel | undefined> {
    return await knex<SchedulingHistoryModel>('scheduling_historys')
      .select()
      .where({ scheduling_history_id })
      .del();
  }

  async update(
    scheduling_history: SchedulingHistoryModel
  ): Promise<SchedulingHistoryModel | undefined> {
    const results = await knex<SchedulingHistoryModel>('scheduling_historys')
      .where({ scheduling_history_id: scheduling_history.scheduling_history_id })
      .update(scheduling_history)
      .returning('*');

    return results[0];
  }
}

export { SchedulingHistoryRepository };
