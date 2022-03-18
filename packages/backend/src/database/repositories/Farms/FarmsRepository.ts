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

  async updateFarm(farm: FarmModel): Promise<FarmModel | undefined> {
    const result = await knex<FarmModel>('farms')
      .where({ farm_id: farm.farm_id })
      .update(farm)
      .returning('*');

    return result[0];
  }

  async deleteFarm(farm_id: string): Promise<number | undefined> {
    const delResult = await knex<Farm>('farms')
      .select()
      .where({ farm_id })
      .del();

    return delResult;
  }

  async getOneFarm(farm_id: string): Promise<FarmModel | undefined> {
    const farms = await knex<Farm>('farms').select().where({ farm_id }).first();

    return farms;
  }

  async getFarmsByUser(
    user_id: string | undefined
  ): Promise<FarmModel[] | undefined> {
    const farms = await knex<Farm>('farms').select().where({ user_id });

    return farms;
  }
}

export { FarmsRepository };
