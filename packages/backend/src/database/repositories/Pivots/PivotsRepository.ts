import knex from '../..';
import { realdAllPivots } from '../../../models/pivot';
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

  async findByNodeId(
    node_id: string | undefined
  ): Promise<PivotModel[] | undefined> {
    return await knex<PivotModel>('pivots').select().where({ node_id });
  }

  async create(pivot: PivotModel): Promise<PivotModel | undefined> {
    const newPivot = await knex<PivotModel>('pivots')
      .insert(pivot)
      .returning('*');

    return newPivot[0];
  }

  async getAll(farm_id: string): Promise<PivotModel[]> {
    return await knex<PivotModel>('pivots').select().where({ farm_id });
  }

  async getOne(
    pivot_num: number,
    farm_id: string
  ): Promise<PivotModel | undefined> {
    return await knex<PivotModel>('pivots')
      .select()
      .where({ farm_id, pivot_num })
      .first();
  }

  async delete(pivot_id: string): Promise<number | undefined> {
    return await knex<PivotModel>('pivots').select().where({ pivot_id }).del();
  }

  async update(
    pivot: PivotModel,
    pivot_id: PivotModel['pivot_id']
  ): Promise<PivotModel | undefined> {
    const pivots = await knex<PivotModel>('pivots')
      .where({ pivot_id })
      .update(pivot)
      .returning('*');

    return pivots[0];
  }

  async readAll(farm_id: string): Promise<realdAllPivots[] | undefined> {
    const pivots: realdAllPivots[] = await knex<PivotModel>('pivots')
      .select('*')
      .join('nodes', 'pivots.node_id', 'nodes.node_id')
      .where('nodes.farm_id', farm_id);

    return pivots;
  }
}

export { PivotsRepository };
