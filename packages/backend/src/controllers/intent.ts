import { Pivot, Intent } from '@prisma/client';
import db from '../database';

export const readAllIntentController = async() => {
  const allIntents = await db.intent.findMany();

  return allIntents;
}

export const updateIntentController = async (
  pivot_id: Pivot['pivot_id'],
  power: Intent['power'],
  water: Intent['water'],
  direction: Intent['direction'],
  percentimenter: Intent['percentimenter'],
): Promise<Intent> => {
  const response = await db.intent.update({
    data: {
      power,
      water,
      direction,
      percentimenter,
    },
    where: { pivot_id }
  });

	return response;
};
