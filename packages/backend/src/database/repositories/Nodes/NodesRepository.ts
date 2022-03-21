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

  async findAllByFarms(farm_id: string): Promise<Pick<Node, 'node_id'>[]> {
    return await knex<Node>('nodes').select('node_id').where({ farm_id });
  }
}

export { NodesRepository };
