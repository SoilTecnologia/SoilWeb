import knex from '../..';
import { SchedulingAngleModel } from '../../model/SchedulingAngle';
import { ISchedulingAngleRepository } from './ISchedulingAngleRepository';

class SchedulingAngleRepository implements ISchedulingAngleRepository {
  async findByPivotId(pivot_id: string): Promise<SchedulingAngleModel[]> {
    return await knex<SchedulingAngleModel>('scheduling_angles')
      .select('*')
      .where({ pivot_id })
      .orderBy('start_timestamp', 'asc');
  }

  async findById(
    scheduling_angle_id: string
  ): Promise<SchedulingAngleModel | undefined> {
    return await knex<SchedulingAngleModel>('scheduling_angles')
      .select()
      .where({ scheduling_angle_id })
      .orderBy('start_timestamp', 'asc')
      .first();
  }

  async getAllSchedulingsAngle(): Promise<SchedulingAngleModel[]> {
    return await knex<SchedulingAngleModel>('scheduling_angles').select();
  }

  async create(
    scheduling_angle: Omit<SchedulingAngleModel, 'scheduling_angle_id'>
  ): Promise<SchedulingAngleModel | undefined> {
    const newSchedulingAngle = await knex<SchedulingAngleModel>(
      'scheduling_angles'
    )
      .insert(scheduling_angle)
      .returning('*');

    return newSchedulingAngle[0];
  }

  async delete(
    scheduling_angle_id: string
  ): Promise<SchedulingAngleModel | undefined> {
    return await knex<SchedulingAngleModel>('scheduling_angles')
      .select()
      .where({ scheduling_angle_id })
      .del();
  }

  async update(
    scheduling_angle: SchedulingAngleModel
  ): Promise<SchedulingAngleModel | undefined> {
    const results = await knex<SchedulingAngleModel>('scheduling_angles')
      .where({ scheduling_angle_id: scheduling_angle.scheduling_angle_id })
      .update(scheduling_angle)
      .returning('*');
    return results[0];
  }
}

export { SchedulingAngleRepository };
