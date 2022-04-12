import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetPivotByIdUseCase {
  constructor(
    @inject('PivotsRepository') private pivotsRepository: IPivotsRepository
  ) {}

  private async applyQuerGetById(pivot_id: string) {
    try {
      return await this.pivotsRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetPivotByIdUseCase.name,
        'Get Pivot By Id'
      );
    }
  }

  async execute(pivot_id: string) {
    const pivot = await this.applyQuerGetById(pivot_id);

    if (!pivot) throw new Error('Does not found Pivot');

    return pivot;
  }
}

export { GetPivotByIdUseCase };
