import Node from '../../../models/node';
import { FarmModel } from '../../model/Farm';

interface INodesRepository {
  findAllByFarms(
    farm_id: FarmModel['farm_id']
  ): Promise<Pick<Node, 'node_id'>[]>;
}

export { INodesRepository };
