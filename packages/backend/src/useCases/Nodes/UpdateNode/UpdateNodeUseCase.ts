import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';

@injectable()
class UpdateNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  async execute(node: NodeModel) {
    const nodeModel = new NodeModel();

    const nodeAlreadyExists = await this.nodeRepository.findById(node.node_id);

    if (nodeAlreadyExists) {
      Object.assign(nodeModel, {
        node_id: node.node_id ? node.node_id : nodeAlreadyExists.node_id,
        node_num: node.node_num ? node.node_num : nodeAlreadyExists.node_num,
        farm_id: node.farm_id ? node.farm_id : nodeAlreadyExists.farm_id,
        is_gprs: node.is_gprs ? node.is_gprs : nodeAlreadyExists.is_gprs,
        gateway: node.gateway ? node.gateway : nodeAlreadyExists.gateway
      });

      const newNodeData = await this.nodeRepository.update(nodeModel);

      return newNodeData;
    }
    throw new Error('Node do not exists');
  }
}

export { UpdateNodeUseCase };
