import { inject, injectable } from 'tsyringe';
import { PivotModel } from '@database/model/Pivot';
import { PivotsRepository } from '@database/repositories/Pivots/PivotsRepository';
import { messageErrorTryAction } from '@utils/types';

@injectable()
class CreatePivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: PivotsRepository
  ) {}

  private async applyQueryFindPivot(pivot_num: number, farm_id: string) {
    try {
      return await this.pivotRepository.getOne(pivot_num, farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreatePivotUseCase.name,
        'Find Pivot By Id'
      );
    }
  }

  private async applyQueryCreatePivot(pivot: PivotModel) {
    try {
      return await this.pivotRepository.create(pivot);
    } catch (err) {
      messageErrorTryAction(err, true, CreatePivotUseCase.name, 'Create Pivot');
    }
  }

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

    const pivotAlreadyExists = await this.applyQueryFindPivot(
      pivot_num,
      farm_id
    );

    if (pivotAlreadyExists) throw new Error('Pivot Already Exists');

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

    return await this.applyQueryCreatePivot(pivotModel);
  }
}

export { CreatePivotUseCase };
