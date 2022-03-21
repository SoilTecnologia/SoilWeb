import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class ReadAllUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(farm_id: PivotModel['farm_id']) {
    return this.pivotRepository.readAll(farm_id);
  }
}

export { ReadAllUseCase };
