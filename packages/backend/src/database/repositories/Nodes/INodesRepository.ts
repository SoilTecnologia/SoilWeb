import Node from '../../../models/node';
import { FarmModel } from '../../model/Farm';
import { PivotModel } from '../../model/Pivot';

interface INodesRepository {
  findById(node_id: Node['node_id']): Promise<Node | undefined>;
  findAllByFarms(
    farm_id: FarmModel['farm_id']
  ): Promise<Pick<Node, 'node_id'>[]>;

  findByPivotId(pivot_id: PivotModel['pivot_id']): Promise<Node | undefined>;
}

export { INodesRepository };
