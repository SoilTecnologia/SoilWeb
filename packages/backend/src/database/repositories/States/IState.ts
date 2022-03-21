import State from '../../../models/state';
import { PivotModel } from '../../model/Pivot';

interface IStateRepository {
  findByPivotId(pivot_id: PivotModel['pivot_id']): Promise<State | undefined>;
}

export { IStateRepository };
