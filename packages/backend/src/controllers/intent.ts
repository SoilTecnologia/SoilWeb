import { Radio, Intent } from '@prisma/client';
import db from '../database';
import emitter from '../utils/eventBus';

export const readAllIntentController = async () => {
  const allIntents = await db.intent.findMany();

  return allIntents;
};

export const updateIntentController = async (
  pivot_id: Radio['pivot_id'],
  power: Intent['power'],
  water: Intent['water'],
  direction: Intent['direction'],
  percentimeter: Intent['percentimeter']
): Promise<Intent> => {
  let response: Intent;

    response = await db.intent.update({
      data: {
        power,
        water,
        direction,
        percentimeter
      },
      where: { pivot_id }
    });

  emitter.emit('intent', response);
  return response;
};
