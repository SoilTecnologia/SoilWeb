import Node from '../models/node';

import knex from '../database';
import { deleteNode } from '../utils/deleteCascade';

export const createNodeController = async (node: Node) => {
  const newNode = await knex<Node>('nodes').insert({ ...node });

  return newNode;
};

export const readAllNodeController = async (farm_id: Node['farm_id']) => {
  const allNodesFromFarm = await knex<Node>('nodes')
    .select('*')
    .where({ farm_id });

  return allNodesFromFarm;
};

export const deleteNodeController = async (node_id: Node['node_id']) => {
  if (node_id) {
    try {
      await deleteNode('node', node_id);
    } catch (err) {
      console.log('[ERROR] Internal Server Error');
      console.log(err);
    }
  }
};
