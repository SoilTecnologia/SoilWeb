import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../../database/model/Pivot';
import { IPivotsRepository } from '../../../../database/repositories/Pivots/IPivotsRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class UpdatePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  private async applyQueryFindById(pivot_id: string) {
    try {
      return this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotUseCase.name,
        'Find Pivot By Id'
      );
    }
  }

  private async applyQueryUpdatePivot(pivot: PivotModel, pivot_id: string) {
    try {
      return this.pivotRepository.update(pivot, pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdatePivotUseCase.name,
        'Find Pivot By Id'
      );
    }
  }

  async execute(pivot: PivotModel) {
    const getPivot = await this.applyQueryFindById(pivot.pivot_id);
    if (!getPivot) throw new Error('Pivot Does Not Find');

    const pivotModel = new PivotModel();

    const pivot_id = `${pivot.farm_id}_${pivot.pivot_num}`;
    Object.assign(pivotModel, {
      ...getPivot,
      pivot_id,
      pivot_lat: pivot.pivot_lat ? pivot.pivot_lat : getPivot.pivot_lat,
      pivot_lng: pivot.pivot_lng ? pivot.pivot_lng : getPivot.pivot_lng,
      pivot_num: pivot.pivot_num ? pivot.pivot_num : getPivot.pivot_num,
      pivot_radius: pivot.pivot_radius
        ? pivot.pivot_radius
        : getPivot.pivot_radius,
      pivot_start_angle: pivot.pivot_start_angle
        ? pivot.pivot_start_angle
        : getPivot.pivot_start_angle,
      pivot_end_angle: pivot.pivot_end_angle
        ? pivot.pivot_end_angle
        : getPivot.pivot_end_angle,
      radio_id: pivot.radio_id ? pivot.radio_id : getPivot.radio_id
    });

    return await this.applyQueryUpdatePivot(pivotModel, getPivot.pivot_id);
  }
}

export { UpdatePivotUseCase };
