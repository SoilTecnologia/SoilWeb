import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeletePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryFindById(pivot_id: string) {
    try {
      return await this.pivotRepository.delete(pivot_id);
    } catch (err) {
      messageErrorTryAction(err, true, DeletePivotUseCase.name, 'Delete Pivot');
    }
  }

  private async applyQueryDelete(pivot_id: string) {
    try {
      return await this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeletePivotUseCase.name,
        'Find Pivot By Id'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const farm = await this.applyQueryFindById(pivot_id);

    if (!farm) throw new Error('Pivot Does Not Exists');
    return await this.pivotRepository.delete(pivot_id);
  }
}

export { DeletePivotUseCase };
