import { inject, injectable } from 'tsyringe';
import { NodeModel } from '../../../database/model/Node';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllByFarmIdUseCase {
  constructor(
    @inject('NodesRepository') private nodeRepository: INodesRepository
  ) {}

  private async applyQueryGetNodesByFarm(farm_id: string) {
    try {
      return await this.nodeRepository.findListByFarms(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllByFarmIdUseCase.name,
        'Get All nodes By Farm'
      );
    }
  }

  async execute(farm_id: NodeModel['farm_id']) {
    return await this.applyQueryGetNodesByFarm(farm_id);
  }
}

export { GetAllByFarmIdUseCase };
