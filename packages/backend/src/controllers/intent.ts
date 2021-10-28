import { Radio, Intent } from '@prisma/client';
import db from '../database';

export const readAllIntentController = async() => {
  const allIntents = await db.intent.findMany();

  return allIntents;
}

export const updateIntentController = async (
  radio_id: Radio['radio_id'],
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
    where: { radio_id }
  });

	return response;
};
