import State from '../../../models/state';
import { PivotModel } from '../../model/Pivot';
import { StateModel } from '../../model/State';

interface IStateRepository {
  findByPivotId(pivot_id: PivotModel['pivot_id']): Promise<State | undefined>;
  findById(state_id: State['state_id']): Promise<State | undefined>;
  create(state: Omit<StateModel, 'state_id'>): Promise<State>;
}

export { IStateRepository };
