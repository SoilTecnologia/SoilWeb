import knex from '../..';
import Farm from '../../../models/farm';
import { FarmModel } from '../../model/Farm';
import { IFarmsRepository } from './IFarmsRepository';

class FarmsRepository implements IFarmsRepository {
  private static INSTANCE: FarmsRepository;

  public static getInstance(): FarmsRepository {
    if (!FarmsRepository.INSTANCE) {
      FarmsRepository.INSTANCE = new FarmsRepository();
    }

    return FarmsRepository.INSTANCE;
  }

  async findById(farm_id: string): Promise<FarmModel | undefined> {
    return await knex<FarmModel>('farms')
      .select('*')
      .where({ farm_id })
      .first();
  }

  async create(farm: FarmModel): Promise<FarmModel | undefined> {
    const newFarm = await knex<Farm>('farms').insert(farm).returning('*');

    return newFarm[0];
  }
}

export { FarmsRepository };
