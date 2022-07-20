import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetPivotByNode {
  constructor(
    @inject('PivotsRepository') private pivotsRepository: IPivotsRepository
  ) {}

  private async applyQuerGetById(node_id: string) {
    try {
      return await this.pivotsRepository.findByNodeId(node_id);
    } catch (err) {
      messageErrorTryAction(err, true, GetPivotByNode.name, 'Get Pivot By Id');
    }
  }

  async execute(node_id: string) {
    const pivot = await this.applyQuerGetById(node_id);

    if (!pivot) throw new Error(`Does not found ${node_id} in database`);

    return pivot;
  }
}

export { GetPivotByNode };
