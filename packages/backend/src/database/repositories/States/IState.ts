import { PivotModel } from '../../model/Pivot';
import { StateModel } from '../../model/State';

interface IStateRepository {
  findByPivotId(
    pivot_id: PivotModel['pivot_id']
  ): Promise<StateModel | undefined>;
  
  findById(state_id: StateModel['state_id']): Promise<StateModel | undefined>;

  create(state: Omit<StateModel, 'state_id'>): Promise<StateModel | undefined>;

  getLastState(
    pivot_id: StateModel['pivot_id']
  ): Promise<Pick<StateModel, 'state_id' | 'power'> | undefined>;

  getLastOffState(
    pivot_id: StateModel['pivot_id']
  ): Promise<Pick<StateModel, 'timestamp' | 'power'> | undefined>;

  beforeThat(
    pivot_id: StateModel['pivot_id'],
    timestamp: StateModel['timestamp']
  ): Promise<any[]>;

  getHistoryCycle(
    pivot_id: StateModel['pivot_id'],
    start: string,
    end: string
  ): Promise<any[]>;
}

export { IStateRepository };
