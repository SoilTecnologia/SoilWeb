import knex from '../..';
import { NodeModel } from '../../model/Node';
import { INodesRepository } from './INodesRepository';

class NodesRepository implements INodesRepository {
  async findById(node_id: string | undefined): Promise<NodeModel | undefined> {
    return await knex<NodeModel>('nodes').select().where({ node_id }).first();
  }

  async findAllByFarms(farm_id: string): Promise<Pick<NodeModel, 'node_id'>[]> {
    return await knex<NodeModel>('nodes').select('node_id').where({ farm_id });
  }

  async findListByFarms(farm_id: string): Promise<NodeModel[]> {
    return await knex<NodeModel>('nodes').select().where({ farm_id });
  }

  async findByPivotId(node_id: string): Promise<NodeModel | undefined> {
    return await knex<NodeModel>('nodes').select().where({ node_id }).first();
  }

  async findByNodeNum(
    farm_id: NodeModel['farm_id'],
    node_num: NodeModel['node_num']
  ): Promise<NodeModel | undefined> {
    return await knex<NodeModel>('nodes')
      .select()
      .where({ farm_id, node_num })
      .first();
  }

  async create(
    node: Omit<NodeModel, 'node_id'>
  ): Promise<NodeModel | undefined> {
    const newNode = await knex<NodeModel>('nodes').insert(node).returning('*');
    return newNode[0];
  }

  async delete(node_id: string | undefined): Promise<number | undefined> {
    return await knex<NodeModel>('nodes').select().where({ node_id }).del();
  }

  async update(node: NodeModel): Promise<NodeModel | undefined> {
    const newNode = await knex<NodeModel>('nodes')
      .where({ node_id: node.node_id })
      .update(node)
      .returning('*');

    return newNode[0];
  }
}

export { NodesRepository };
