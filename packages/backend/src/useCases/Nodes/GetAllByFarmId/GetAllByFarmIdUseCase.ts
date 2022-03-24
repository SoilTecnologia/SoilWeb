import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';

@injectable()
class GetAllByFarmIdUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  async execute(farm_id: NodeModel['farm_id']) {
    const nodes = await this.nodeRepository.findListByFarms(farm_id);

    return nodes;
  }
}

export { GetAllByFarmIdUseCase };
