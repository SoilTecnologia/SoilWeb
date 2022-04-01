import { inject, injectable } from 'tsyringe';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetOneNodeUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryGetNode(node_id: string) {
    try {
      return await this.nodeRepository.findById(node_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetOneNodeUseCase.name,
        'Get Node By Id'
      );
    }
  }

  async execute(node_id: string) {
    return await this.applyQueryGetNode(node_id);
  }
}

export { GetOneNodeUseCase };
