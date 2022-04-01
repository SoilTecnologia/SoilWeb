import { FarmModel } from '../../model/Farm';
import { NodeModel } from '../../model/Node';
import { PivotModel } from '../../model/Pivot';

interface INodesRepository {
  findById(node_id: NodeModel['node_id']): Promise<NodeModel | undefined>;
  findAllByFarms(
    farm_id: FarmModel['farm_id']
  ): Promise<Pick<NodeModel, 'node_id'>[]>;

  findListByFarms(farm_id: FarmModel['farm_id']): Promise<NodeModel[]>;
  findByNodeNum(
    farm_id: NodeModel['farm_id'],
    node_num: NodeModel['node_num']
  ): Promise<NodeModel | undefined>;

  findByPivotId(
    pivot_id: PivotModel['pivot_id']
  ): Promise<NodeModel | undefined>;
  create(node: Omit<NodeModel, 'node_id'>): Promise<NodeModel | undefined>;
  delete(node_id: NodeModel['node_id']): Promise<number | undefined>;

  update(node: NodeModel): Promise<NodeModel | undefined>;
}

export { INodesRepository };
