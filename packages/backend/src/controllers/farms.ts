import knex from '../database';
import Farm from '../models/farm';
import User from '../models/user';

export const createFarmController = async (
  farm_id: Farm['farm_id'],
  user_id: Farm['user_id'],
  farm_name: Farm['farm_name'],
  farm_city: Farm['farm_city'],
  farm_lng: Farm['farm_lng'],
  farm_lat: Farm['farm_lat']
) => {
  const newFarm = await knex<Farm>('farms').insert({
    farm_id,
    user_id,
    farm_name,
    farm_city,
    farm_lng,
    farm_lat
  });

  return newFarm;
};

export const readAllFarmController = async (
  user_id: User['user_id']
): Promise<Pick<Farm, 'farm_id' | 'farm_name' | 'farm_city'>[]> => {
  const farms = await knex<Farm>('farms')
    .select('farm_name', 'farm_city', 'farm_id')
    .where({ user_id });

  return farms;
};

export const getAllFarmUser = async (user_id: User['user_id']) => {
  const farms = await knex<Farm>('farms').select().where({ user_id });

  return farms;
};

export const readMapFarmControler = async (farm_id: Farm['farm_id']) => {
  const result = await knex('farms')
    .join('nodes', 'farms.farm_id', 'nodes.farm_id')
    .select('*');

  return result;
};

export const deleteFarmController = async (farm_id: Farm['farm_id']) => {
  try {
    const farm = await knex<Farm>('farms').select().where({ farm_id }).first();
    if (farm) {
      const delResult = await knex<Farm>('farms')
        .select()
        .where({ farm_id })
        .del();
      return delResult;
    }
  } catch (err) {
    console.log('[ERROR] Internal Server Error');
    console.log(err);
  }
};

export const putFarmController = async (farm: Farm) => {
  const getFarm = await knex<Farm>('farms')
    .select()
    .where({ farm_id: farm.farm_id })
    .first();

  if (getFarm) {
    await knex<Farm>('farms')
      .where({ farm_id: farm.farm_id })
      .update({
        ...getFarm,
        farm_name: farm.farm_name ? farm.farm_name : getFarm.farm_name,
        farm_city: farm.farm_city ? farm.farm_city : getFarm.farm_city,
        farm_lng: farm.farm_lng ? farm.farm_lng : getFarm.farm_lng,
        farm_lat: farm.farm_lat ? farm.farm_lat : getFarm.farm_lat
      });

    const newFarm = await knex<Farm>('farms')
      .select()
      .where({ farm_id: farm.farm_id })
      .first();

    return newFarm;
  }
  throw new Error('[ERROR] Farm not find');
};
