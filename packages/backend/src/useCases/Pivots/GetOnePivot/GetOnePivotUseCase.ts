import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetOnePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryGetOnePivot(pivot_num: number, farm_id: string) {
    try {
      return this.pivotRepository.getOne(pivot_num, farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetOnePivotUseCase.name,
        'Get One Pivot of the farm'
      );
    }
  }

  async execute(
    pivot_num: PivotModel['pivot_num'],
    farm_id: PivotModel['farm_id']
  ) {
    return await this.applyQueryGetOnePivot(pivot_num, farm_id);
  }
}

export { GetOnePivotUseCase };
