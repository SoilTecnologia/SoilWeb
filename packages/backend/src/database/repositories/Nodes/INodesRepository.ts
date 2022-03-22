import Node from '../../../models/node';
import { FarmModel } from '../../model/Farm';
import { NodeModel } from '../../model/Node';
import { PivotModel } from '../../model/Pivot';

interface INodesRepository {
  findById(node_id: Node['node_id']): Promise<Node | undefined>;
  findAllByFarms(
    farm_id: FarmModel['farm_id']
  ): Promise<Pick<Node, 'node_id'>[]>;

  findByPivotId(pivot_id: PivotModel['pivot_id']): Promise<Node | undefined>;
  create(node: Omit<NodeModel, 'node_id'>): Promise<Node | undefined>;
  delete(node_id: NodeModel['node_id']): Promise<number | undefined>;
  update(node: NodeModel): Promise<NodeModel | undefined>;
}

export { INodesRepository };
