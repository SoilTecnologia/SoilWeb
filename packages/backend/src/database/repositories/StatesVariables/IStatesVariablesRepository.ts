import { StateModel } from '../../model/State';
import { StateVariableModel } from '../../model/StateVariables';

interface IStatesVariableRepository {
  findByStateId(
    state_id: StateModel['state_id']
  ): Promise<StateVariableModel | undefined>;

  create(
    stateVariable: Omit<StateVariableModel, 'state_variable_id'>
  ): Promise<StateVariableModel>;

  getAnglePercentimeter(
    state_id: StateVariableModel['state_id']
  ): Promise<Pick<StateVariableModel, 'angle' | 'percentimeter'>[]>;

  getVariableGroupBy(
    state_id: StateVariableModel['state_id']
  ): Promise<
    Pick<StateVariableModel, 'angle' | 'percentimeter' | 'timestamp'>[]
  >;

  updateAngle(
    state_id: StateVariableModel['state_variable_id'],
    angle: StateVariableModel['angle']
  ): Promise<StateVariableModel>;

  updatePercentimeter(
    state_id: StateVariableModel['state_variable_id'],
    percentimeter: StateVariableModel['percentimeter']
  ): Promise<StateVariableModel>;
}

export { IStatesVariableRepository };
