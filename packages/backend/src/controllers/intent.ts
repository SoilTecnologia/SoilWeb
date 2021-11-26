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

  const intent = await db.intent.findFirst({
    where: { pivot_id }
  });

  response = await db.intent.update({
    data: {
      power,
      water,
      direction,
      percentimeter
    },
    where: { intent_id: intent!.intent_id }
  });

  const pivot = await db.pivot.findFirst({ where: { pivot_id } });
  const { node_id } = pivot!;

  const node = await db.node.findFirst({ where: { node_id } });
  const { farm_id, node_name, isGPRS } = node!;

  if (isGPRS) {
    emitter.emit('intent', {
      isGPRS,
      intent: { power, water, direction, percentimeter },
      farm_id,
      node_name
    });
  } else {
    emitter.emit('intent', {
      intent: { power, water, direction, percentimeter },
      farm_id,
      node_name,
      pivot_id
    });
  }
  return response;
};
