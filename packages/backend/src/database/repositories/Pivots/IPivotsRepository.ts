import { FarmModel } from '../../model/Farm';
import { PivotModel } from '../../model/Pivot';

interface IPivotsRepository {
  findById(pivot_id: PivotModel['pivot_id']): Promise<PivotModel | undefined>;

  create(pivot: PivotModel): Promise<PivotModel | undefined>;
  getAll(farm_id: FarmModel['farm_id']): Promise<PivotModel[]>;
  getOne(
    pivot_num: PivotModel['pivot_num'],
    farm_id: PivotModel['farm_id']
  ): Promise<PivotModel | undefined>;
}

export { IPivotsRepository };
