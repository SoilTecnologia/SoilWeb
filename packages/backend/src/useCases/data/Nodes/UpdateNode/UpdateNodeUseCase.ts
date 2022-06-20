import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../../database/model/Node';
import { INodesRepository } from '../../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../../utils/types';

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

    Object.assign(nodeModel, node);

    return await this.applyQueryUpdateNodes(nodeModel);
  }
}

export { UpdateNodeUseCase };
