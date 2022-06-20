import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../../database/model/Pivot';
import { IPivotsRepository } from '../../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetByPivotIdUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryGetOnePivot(pivot_id: string) {
    try {
      return this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetByPivotIdUseCase.name,
        'Get One Pivot of the farm'
      );
    }
  }

  async execute(pivot_id: PivotModel['pivot_id']) {
    const pivot = await this.applyQueryGetOnePivot(pivot_id);
    if (!pivot) throw new Error('Pivot Does Not found');
    return pivot;
  }
}

export { GetByPivotIdUseCase };
