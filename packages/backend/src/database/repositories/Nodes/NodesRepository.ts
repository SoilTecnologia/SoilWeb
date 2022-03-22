import knex from '../..';
import Node from '../../../models/node';
import { NodeModel } from '../../model/Node';
import { INodesRepository } from './INodesRepository';

class NodesRepository implements INodesRepository {
  async findById(node_id: string | undefined): Promise<Node | undefined> {
    return await knex<Node>('nodes').select().where({ node_id }).first();
  }

  async findAllByFarms(farm_id: string): Promise<Pick<Node, 'node_id'>[]> {
    return await knex<Node>('nodes').select('node_id').where({ farm_id });
  }

  async findByPivotId(node_id: string): Promise<Node | undefined> {
    return await knex<Node>('nodes').select().where({ node_id }).first();
  }

  async create(node: Omit<NodeModel, 'node_id'>): Promise<Node | undefined> {
    const newNode = await knex<Node>('nodes').insert(node).returning('*');
    return newNode[0];
  }

  async delete(node_id: string | undefined): Promise<number | undefined> {
    return await knex<Node>('nodes').select().where({ node_id }).del();
  }

  async update(node: NodeModel): Promise<NodeModel | undefined> {
    const newNode = await knex<Node>('nodes')
      .where({ node_id: node.node_id })
      .update(node)
      .returning('*');

    return newNode[0];
  }
}

export { NodesRepository };
