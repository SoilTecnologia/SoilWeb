import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryFindByNodes(node_id: string) {
    try {
      return await this.nodeRepository.findById(node_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateNodeUseCase.name,
        'Find Node By Node Id'
      );
    }
  }

  private async applyQueryUpdateNodes(node: NodeModel) {
    try {
      return await this.nodeRepository.update(node);
    } catch (err) {
      messageErrorTryAction(err, true, UpdateNodeUseCase.name, 'Update Node');
    }
  }

  async execute(node: NodeModel) {
    const nodeModel = new NodeModel();

    const nodeAlreadyExists = await this.applyQueryFindByNodes(node.node_id!!);

    if (!nodeAlreadyExists) throw new Error('Does not Find Node');

    Object.assign(nodeModel, {
      node_id: node.node_id ? node.node_id : nodeAlreadyExists.node_id,
      node_num: node.node_num ? node.node_num : nodeAlreadyExists.node_num,
      farm_id: node.farm_id ? node.farm_id : nodeAlreadyExists.farm_id,
      is_gprs: node.is_gprs ? node.is_gprs : nodeAlreadyExists.is_gprs,
      gateway: node.gateway ? node.gateway : nodeAlreadyExists.gateway
    });

    return await this.applyQueryUpdateNodes(nodeModel);
  }
}

export { UpdateNodeUseCase };
