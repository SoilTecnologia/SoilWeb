import Farm from '../models/farm';
import User from '../models/user';

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

// export const updateFarmController = async (
//   farm_id: Farm['farm_id'],
//   farm_name?: Farm['farm_name'],
//   city?: Farm['city'],
//   lng?: Farm['lng'],
//   lat?: Farm['lat'],
// ): Promise<Farm> => {
//   const newFarm = await db.farm.update({
//     data: {
//       farm_name,
//       city,
//       lng,
//       lat,
//     },
//     where: {
//       farm_id
//     }
//   });

//   return newFarm;
// };

// export const deleteFarmController = async (
//   farm_id: Farm['farm_id']
// ): Promise<boolean> => {
//   await db.node.deleteMany({where: {farm_id}})
//   await db.farmUser.deleteMany({where: {farm_id}})
//   await db.farm.delete({ where: { farm_id } });

//   return true;
// };
