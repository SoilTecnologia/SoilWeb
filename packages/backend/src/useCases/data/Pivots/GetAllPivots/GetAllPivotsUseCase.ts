import { inject, injectable } from 'tsyringe';
import { FarmModel } from '../../../../database/model/Farm';
import { IPivotsRepository } from '../../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetAllPivotsUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryFindPivotOfFarms(farm_id: string) {
    try {
      return await this.pivotRepository.getAll(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetAllPivotsUseCase.name,
        'Get All Pivot Of The Farms'
      );
    }
  }

  async execute(farm_id: FarmModel['farm_id']) {
    return await this.applyQueryFindPivotOfFarms(farm_id);
  }
}

export { GetAllPivotsUseCase };
