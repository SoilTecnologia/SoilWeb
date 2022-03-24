import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';

@injectable()
class CreateNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  async execute(node: Omit<NodeModel, 'node_id'>) {
    const { node_num, farm_id, is_gprs, gateway } = node;
    const nodeModel = new NodeModel();

    Object.assign(nodeModel, { node_num, farm_id, is_gprs, gateway });

    const newNode = await this.nodeRepository.create(nodeModel);

    return newNode;
  }
}

export { CreateNodeUseCase };
