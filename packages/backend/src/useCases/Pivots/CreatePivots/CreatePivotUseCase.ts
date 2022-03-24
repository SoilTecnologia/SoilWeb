import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { PivotsRepository } from '../../../database/repositories/Pivots/PivotsRepository';

@injectable()
class CreatePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: PivotsRepository
  ) {}

  async execute(pivot: Omit<PivotModel, 'pivot_id'>) {
    const {
      pivot_num,
      pivot_lng,
      pivot_lat,
      pivot_start_angle,
      pivot_end_angle,
      pivot_radius,
      radio_id,
      node_id,
      farm_id
    } = pivot;

    const pivotModel = new PivotModel();

    Object.assign(pivotModel, {
      pivot_id: `${farm_id}_${pivot_num}`,
      pivot_num,
      pivot_lng,
      pivot_lat,
      pivot_start_angle,
      pivot_end_angle,
      pivot_radius,
      radio_id,
      node_id,
      farm_id
    });

    const newPivotData = await this.pivotRepository.create(pivotModel);

    return newPivotData;
  }
}

export { CreatePivotUseCase };
