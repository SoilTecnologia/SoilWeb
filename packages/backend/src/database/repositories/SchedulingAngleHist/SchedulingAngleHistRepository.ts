import knex from '../..';
import { SchedulingAngleHistModel } from '../../model/SchedulingAngleHist';
import { ISchedulingAngleHistRepository } from './ISchedulingAngleHistRepository';

class SchedulingAngleHistRepository implements ISchedulingAngleHistRepository {
  async findByPivotId(pivot_id: string): Promise<SchedulingAngleHistModel[]> {
    return await knex<SchedulingAngleHistModel>('scheduling_angle_hists')
      .select('*')
      .where({ pivot_id })
      .orderBy('start_timestamp', 'asc');
  }

  async findById(
    scheduling_angle_hist_id: string
  ): Promise<SchedulingAngleHistModel | undefined> {
    return await knex<SchedulingAngleHistModel>('scheduling_angle_hists')
      .select()
      .where({ scheduling_angle_hist_id })
      .orderBy('start_timestamp', 'asc')
      .first();
  }

  async findByUserId(author: string | undefined): Promise<SchedulingAngleHistModel[] | undefined> {
    return await knex<SchedulingAngleHistModel>('scheduling_angle_hists')
      .select('*')
      .where({ author }) 
      .orderBy('start_timestamp', 'asc');
  }

  async getAllSchedulingsAngle(): Promise<SchedulingAngleHistModel[]> {
    return await knex<SchedulingAngleHistModel>('scheduling_angle_hists').select();
  }

  async create(
    scheduling_angle_hist: Omit<SchedulingAngleHistModel, 'scheduling_angle_hist_id'>
  ): Promise<SchedulingAngleHistModel | undefined> {
    const newSchedulingAngle = await knex<SchedulingAngleHistModel>(
      'scheduling_angle_hists'
    )
      .insert(scheduling_angle_hist)
      .returning('*');

    return newSchedulingAngle[0];
    
  }

  async delete(
    scheduling_angle_hist_id: string
  ): Promise<SchedulingAngleHistModel | undefined> {
    return await knex<SchedulingAngleHistModel>('scheduling_angle_hists')
      .select()
      .where({ scheduling_angle_hist_id })
      .del();
  }

  async update(
    scheduling_angle: SchedulingAngleHistModel
  ): Promise<SchedulingAngleHistModel | undefined> {
    const results = await knex<SchedulingAngleHistModel>('scheduling_angle_hists')
      .where({ scheduling_angle_hist_id: scheduling_angle.scheduling_angle_hist_id })
      .update(scheduling_angle)
      .returning('*');
    return results[0];
  }
}

export { SchedulingAngleHistRepository };
