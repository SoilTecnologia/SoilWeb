import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class DeletePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(pivot_id: PivotModel['pivot_id']) {
    const farm = await this.pivotRepository.findById(pivot_id);

    if (farm) {
      return await this.pivotRepository.delete(pivot_id);
    }

    throw new Error('Pivot Does Not Exists');
  }
}

export { DeletePivotUseCase };
