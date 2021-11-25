import Pivot, {PivotUpdate} from '../models/pivot';
import State from '../models/state';

import knex from '../database';

export const createPivotController = async (
  pivot_id: Pivot['pivot_id'],
  node_id: Pivot['node_id'],
  pivot_name: Pivot['pivot_name'],
  pivot_lng: Pivot['pivot_lng'],
  pivot_lat: Pivot['pivot_lat'],
  pivot_start_angle: Pivot['pivot_start_angle'],
  pivot_end_angle: Pivot['pivot_end_angle'],
  pivot_radius: Pivot['pivot_radius'],
  radio_id: Pivot['radio_id']
) => {
  const newPivot = await knex<Pivot>('pivots').insert({
    pivot_id,
    node_id,
    pivot_name,
    pivot_lng,
    pivot_lat,
    pivot_start_angle,
    pivot_end_angle,
    pivot_radius,
    last_communication: new Date(),
    radio_id
  });

  return newPivot;
};

export const updatePivotController = async (update: PivotUpdate) => {
	const {pivot_id, connection, power, water, direction, angle, percentimeter, timestamp} = update;

  await knex.transaction(async (trx) => {
    await knex<Pivot>('pivots').transacting(trx).update({last_communication: timestamp}).where({pivot_id});
    await knex<State>('states').transacting(trx).insert({pivot_id, power, water, direction, connection, timestamp});
  })
	// TODO CREATE STATE_VARIABLE

  return null;
};

// export const readAllFarmController = async (
//   user_id: User['user_id']
// ): Promise<FarmUser[]> => {
//   const farms = await db.farmUser.findMany({
//     where: {
//       user_id: user_id
//     },
//     include: {
//       farm: {
//         select: {
//           farm_id: true,
//           farm_name: true,
//           city: true
//         }
//       }
//     }
//   });

//   return farms;
// };

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
