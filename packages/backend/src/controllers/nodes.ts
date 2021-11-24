import Node from '../models/node';

import knex from '../database';

export const createNodeController = async (
  node_id: Node['node_id'],
  farm_id: Node['farm_id'],
  gateway: Node['gateway']
) => {
  const newNode = await knex<Node>('nodes').insert({
    node_id,
    farm_id,
    gateway
  });

  return newNode;
};
