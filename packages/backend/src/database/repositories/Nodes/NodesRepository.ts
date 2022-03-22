import knex from '../..';
import Node from '../../../models/node';
import { INodesRepository } from './INodesRepository';

class NodesRepository implements INodesRepository {
  private static INSTANCE: NodesRepository;

  public static getInstance(): NodesRepository {
    if (!NodesRepository.INSTANCE) {
      NodesRepository.INSTANCE = new NodesRepository();
    }

    return NodesRepository.INSTANCE;
  }

  async findById(node_id: string | undefined): Promise<Node | undefined> {
    return await knex<Node>('nodes').select().where({ node_id }).first();
  }

  async findAllByFarms(farm_id: string): Promise<Pick<Node, 'node_id'>[]> {
    return await knex<Node>('nodes').select('node_id').where({ farm_id });
  }

  async findByPivotId(node_id: string): Promise<Node | undefined> {
    return await knex<Node>('nodes').select().where({ node_id }).first();
  }
}

export { NodesRepository };
