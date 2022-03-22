import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';

@injectable()
class GetByNumByFarmUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  async execute(
    farm_id: NodeModel['farm_id'],
    node_num: NodeModel['node_num']
  ) {
    const node = await this.nodeRepository.findByNodeNum(farm_id, node_num);

    return node;
  }
}

export { GetByNumByFarmUseCase };
