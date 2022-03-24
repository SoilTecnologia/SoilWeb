import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';

@injectable()
class UpdatePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(pivot: PivotModel) {
    const getPivot = await this.pivotRepository.findById(pivot.pivot_id);
    const pivotModel = new PivotModel();

    if (getPivot) {
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

      return await this.pivotRepository.update(pivotModel, getPivot.pivot_id);
    }

    throw new Error('Do not find Pivot');
  }
}

export { UpdatePivotUseCase };
