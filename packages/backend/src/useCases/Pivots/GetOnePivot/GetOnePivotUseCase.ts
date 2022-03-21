import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class GetOnePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(
    pivot_num: PivotModel['pivot_num'],
    farm_id: PivotModel['farm_id']
  ) {
    const pivots = this.pivotRepository.getOne(pivot_num, farm_id);
    return pivots;
  }
}

export { GetOnePivotUseCase };
