import Farm from '../models/farm';
import User from '../models/user';

import knex from '../database';

export const createFarmController = async (
  // farm_id: Farm['farm_id'],
  user_id: Farm['user_id'],
  farm_name: Farm['farm_name'],
  farm_city: Farm['farm_city'],
  farm_lng: Farm['farm_lng'],
  farm_lat: Farm['farm_lat']
) => {
  const newFarm = await knex<Farm>('farms').insert({
    // farm_id,
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
  const farm = await knex<Farm>('farms').select().where({ farm_id }).first();

  if (farm) await knex<Farm>('farms').where({ farm_id }).del();
  else throw new Error('User does not exists');

  return farm;
};
