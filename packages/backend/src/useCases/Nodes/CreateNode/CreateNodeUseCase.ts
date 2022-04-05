import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class CreateNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryFindByNodes(farm_id: string, node_num: number) {
    try {
      return await this.nodeRepository.findByNodeNum(farm_id, node_num);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateNodeUseCase.name,
        'Find Node By Node num And Farm Id'
      );
    }
  }

  private async applyQueryCreateNodes(node: NodeModel) {
    try {
      return await this.nodeRepository.create(node);
    } catch (err) {
      messageErrorTryAction(err, true, CreateNodeUseCase.name, 'Create Node');
    }
  }

  async execute(node: Omit<NodeModel, 'node_id'>) {
    const { node_num, farm_id, is_gprs, gateway } = node;
    const nodeAlreadyExits = await this.applyQueryFindByNodes(
      farm_id,
      node_num
    );
    if (node_num === 0 && nodeAlreadyExits) return nodeAlreadyExits;
    if (nodeAlreadyExits) throw new Error('Node Already Exists');

    const nodeModel = new NodeModel();

    Object.assign(nodeModel, { node_num, farm_id, is_gprs, gateway });

    return await this.applyQueryCreateNodes(nodeModel);
  }
}

export { CreateNodeUseCase };
