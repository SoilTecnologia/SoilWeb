import Farm from '../models/farms';
import User from '../models/users';

import knex from '../database';

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
): Promise<Farm[]> => {
  const farms = await knex<Farm>('farms').select('*').where({ user_id });

  return farms;
};