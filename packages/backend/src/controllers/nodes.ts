import knex from '../database';
import Farm from '../models/farm';
import Node from '../models/node';

// export const createNodeController = async (node: Node) => {
//   const newNode = await knex<Node>('nodes').insert(node).returning('*');

//   return newNode[0];
// };

export const readAllNodeController = async (farm_id: Node['farm_id']) => {
  const allNodesFromFarm = await knex<Node>('nodes')
    .select('*')
    .where({ farm_id });

  return allNodesFromFarm;
};

export const readWithNodeNumController = async (
  farm_id: Farm['farm_id'],
  node_num: Node['node_num']
) => {
  const allNodesFromFarm = await knex<Node>('nodes')
    .select()
    .where({ farm_id, node_num })
    .first();

  return allNodesFromFarm;
};

export const deleteNodeController = async (node_id: Node['node_id']) => {
  if (node_id) {
    try {
      const farm = await knex<Node>('nodes')
        .select()
        .where({ node_id })
        .first();
      if (farm) {
        const delResult = await knex<Node>('nodes')
          .select()
          .where({ node_id })
          .del();
        return delResult;
      }
    } catch (err) {
      console.log('[ERROR] Internal Server Error');
      console.log(err);
    }
  }
};

// export const putNodeController = async (node: Node) => {
//   const getNode = await knex<Node>('nodes')
//     .select()
//     .where({ node_id: node.node_id })
//     .first();

//   if (getNode) {
//     await knex<Node>('nodes')
//       .where({ node_id: node.node_id })
//       .update({
//         ...getNode,
//         node_num: node.node_num ? node.node_num : getNode.node_num,
//         is_gprs: node.is_gprs,
//         gateway: node.gateway ? node.gateway : getNode.gateway
//       });

//     const newNode = await knex<Node>('nodes')
//       .where({ node_id: node.node_id })
//       .select()
//       .first();

//     return newNode;
//   }

//   throw new Error('[ERROR] Node not find');
// };
