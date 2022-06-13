import { FarmModel } from '../../model/Farm';
import { NodeModel } from '../../model/Node';
import { PivotModel } from '../../model/Pivot';
import { readAllPivots } from '../../model/types/pivot';

interface IPivotsRepository {
  findById(pivot_id: PivotModel['pivot_id']): Promise<PivotModel | undefined>;
  findAll(): Promise<PivotModel[]>;
  findByNodeId(
    node_id: NodeModel['node_id']
  ): Promise<PivotModel[] | undefined>;

  create(pivot: PivotModel): Promise<PivotModel | undefined>;
  getAll(farm_id: FarmModel['farm_id']): Promise<PivotModel[]>;
  getOne(
    pivot_num: PivotModel['pivot_num'],
    farm_id: PivotModel['farm_id']
  ): Promise<PivotModel | undefined>;

  delete(pivot_id: PivotModel['pivot_id']): Promise<number | undefined>;

  getLatLong(pivot_id: string): Promise<Pick<PivotModel, "pivot_lat" | "pivot_lng"> | undefined>;

  update(
    pivot: PivotModel,
    pivot_id: PivotModel['pivot_id']
  ): Promise<PivotModel | undefined>;

  readAll(
    farm_id: PivotModel['farm_id']
  ): Promise<readAllPivots[] | undefined>;
}

export { IPivotsRepository };
