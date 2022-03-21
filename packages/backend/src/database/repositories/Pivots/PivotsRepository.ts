import knex from '../..';
import Pivot from '../../../models/pivot';
import { PivotModel } from '../../model/Pivot';
import { IPivotsRepository } from './IPivotsRepository';

class PivotsRepository implements IPivotsRepository {
  private static INSTANCE: PivotsRepository;

  public static getInstance(): PivotsRepository {
    if (!PivotsRepository.INSTANCE) {
      PivotsRepository.INSTANCE = new PivotsRepository();
    }

    return PivotsRepository.INSTANCE;
  }

  async findById(pivot_id: string): Promise<PivotModel | undefined> {
    return await knex<PivotModel>('pivots')
      .select('*')
      .where({ pivot_id })
      .first();
  }

  async create(pivot: PivotModel): Promise<PivotModel | undefined> {
    const newPivot = await knex<PivotModel>('pivots')
      .insert(pivot)
      .returning('*');

    return newPivot[0];
  }

  async getAll(farm_id: string): Promise<PivotModel[]> {
    return await knex<Pivot>('pivots').select().where({ farm_id });
  }

  async getOne(
    pivot_num: number,
    farm_id: string
  ): Promise<PivotModel | undefined> {
    return await knex<Pivot>('pivots')
      .select()
      .where({ farm_id, pivot_num })
      .first();
  }
}

export { PivotsRepository };
