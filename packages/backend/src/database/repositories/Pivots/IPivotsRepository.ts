import { PivotModel } from '../../model/Pivot';

interface IPivotsRepository {
  findById(pivot_id: PivotModel['pivot_id']): Promise<PivotModel | undefined>;

  create(pivot: PivotModel): Promise<PivotModel | undefined>;
}

export { IPivotsRepository };
