import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteNodeUseCase {
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
        DeleteNodeUseCase.name,
        'Find Node By Node Id'
      );
    }
  }

  private async applyQueryDeleteNodes(node_id: string) {
    try {
      return await this.nodeRepository.delete(node_id);
    } catch (err) {
      messageErrorTryAction(err, true, DeleteNodeUseCase.name, 'Create Node');
    }
  }

  async execute(node_id: NodeModel['node_id']) {
    const nodeAlreadyexists = await this.applyQueryFindByNodes(node_id!!);

    if (!nodeAlreadyexists) throw new Error('Node Already Exists');

    return await this.applyQueryDeleteNodes(node_id!!);
  }
}

export { DeleteNodeUseCase };
