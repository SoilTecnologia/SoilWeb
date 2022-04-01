import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetByNumByFarmUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryGetByNodeNum(farm_id: string, node_num: number) {
    try {
      return await this.nodeRepository.findByNodeNum(farm_id, node_num);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetByNumByFarmUseCase.name,
        'Get Node By Farm and Node num'
      );
    }
  }

  async execute(
    farm_id: NodeModel['farm_id'],
    node_num: NodeModel['node_num']
  ) {
    return await this.applyQueryGetByNodeNum(farm_id, node_num);
  }
}

export { GetByNumByFarmUseCase };
