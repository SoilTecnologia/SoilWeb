import Node from '../models/node';

import knex from '../database';

export const createNodeController = async (
  farm_id: Node['farm_id'],
  node_name: Node['node_name'],
  is_gprs: Node['is_gprs'],
  gateway: Node['gateway']
) => {
  
  const newNode = await knex<Node>('nodes').insert({
    farm_id,
    node_name,
    is_gprs,
    gateway
  });

  return newNode;
};

export const readAllNodeController = async(farm_id: Node['farm_id']) => {
  const allNodesFromFarm = await knex<Node>('nodes').select("*").where({farm_id});

  return allNodesFromFarm;
}
