import knex from '../..';
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
}

export { PivotsRepository };
