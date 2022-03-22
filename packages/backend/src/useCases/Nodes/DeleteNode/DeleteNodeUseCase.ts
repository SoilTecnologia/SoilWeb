import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';

@injectable()
class DeleteNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  async execute(node_id: NodeModel['node_id']) {
    const nodeAlreadyexists = await this.nodeRepository.findById(node_id);

    if (nodeAlreadyexists) {
      const delNode = await this.nodeRepository.delete(node_id);

      return delNode;
    }

    throw new Error('Node do not exists');
  }
}

export { DeleteNodeUseCase };
