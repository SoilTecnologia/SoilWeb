import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../database/model/Farm';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class GetAllPivotsUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(farm_id: FarmModel['farm_id']) {
    const pivots = await this.pivotRepository.getAll(farm_id);
    return pivots;
  }
}

export { GetAllPivotsUseCase };
