import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class ReadAllUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryReadAll(farm_id: string) {
    try {
      return await this.pivotRepository.readAll(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadAllUseCase.name,
        'read All Data Pivot'
      );
    }
  }

  async execute(farm_id: PivotModel['farm_id']) {
    return await this.applyQueryReadAll(farm_id);
  }
}

export { ReadAllUseCase };
